import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'omnisettle-jwt-secret-buildathon-2026';
const USERS_FILE = path.resolve(process.cwd(), 'server/data/users.json');

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: 'JUDGE_ADMIN' | 'LEAD_AUDITOR' | 'TREASURY_CFO' | 'OPERATOR';
  passwordHash?: string;
  provider: 'local' | 'otp' | 'google' | 'facebook' | 'gmail';
  avatar?: string;
  createdAt: string;
}

// Default Seed Accounts
const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'usr_judge_01',
    email: 'judge@razorpay.com',
    name: 'Razorpay Buildathon Judge',
    role: 'JUDGE_ADMIN',
    passwordHash: bcrypt.hashSync('judge2026', 10),
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_auditor_02',
    email: 'auditor@big4.com',
    name: 'Big 4 Lead GAAP Auditor',
    role: 'LEAD_AUDITOR',
    passwordHash: bcrypt.hashSync('auditor2026', 10),
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_cfo_03',
    email: 'cfo@enterprise.com',
    name: 'Chief Financial Officer',
    role: 'TREASURY_CFO',
    passwordHash: bcrypt.hashSync('cfo2026', 10),
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_operator_04',
    email: 'operator@omnisettle.ai',
    name: 'FinTech Operator',
    role: 'OPERATOR',
    passwordHash: bcrypt.hashSync('operator2026', 10),
    provider: 'local',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    createdAt: new Date().toISOString(),
  },
];

const usersStore: Map<string, UserRecord> = new Map();

// Initialize default users
for (const u of DEFAULT_USERS) {
  usersStore.set(u.email.toLowerCase(), u);
}

// Load disk persisted users if any
function loadPersistedUsers(): void {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        for (const u of data) {
          if (u && u.email) {
            usersStore.set(u.email.toLowerCase(), u);
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not load persisted users:', e);
  }
}

// Persist users to disk
function persistUsers(): void {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const allUsers = Array.from(usersStore.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(allUsers, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not persist users to disk:', e);
  }
}

loadPersistedUsers();

// In-Memory OTP Store: email -> { otp, expiresAt, attempts }
interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
}
const otpStore: Map<string, OtpRecord> = new Map();

// Helper to sign JWT
function generateToken(user: UserRecord): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// ---------------------------------------------------------------------------
// 1. SIGNUP (Email + Password)
// ---------------------------------------------------------------------------
router.post('/signup', (req: Request, res: Response): void => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanName = name ? name.trim() : normalizedEmail.split('@')[0];

  // If user exists, update password and log in rather than blocking with 409
  let user = usersStore.get(normalizedEmail);
  if (user) {
    user.name = cleanName;
    user.passwordHash = bcrypt.hashSync(password, 10);
    usersStore.set(normalizedEmail, user);
    persistUsers();
    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;
    res.status(200).json({
      token,
      user: safeUser,
      message: 'Account updated and authenticated successfully',
    });
    return;
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    name: cleanName,
    role: 'OPERATOR',
    passwordHash: bcrypt.hashSync(password, 10),
    provider: 'local',
    createdAt: new Date().toISOString(),
  };

  usersStore.set(normalizedEmail, newUser);
  persistUsers();

  const token = generateToken(newUser);
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    token,
    user: safeUser,
    message: 'Account created successfully',
  });
});

// ---------------------------------------------------------------------------
// 2. LOGIN (Email + Password)
// ---------------------------------------------------------------------------
router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = usersStore.get(normalizedEmail);

  // If user does not exist yet, but provides valid email and password >= 4 chars, auto-register
  if (!user) {
    if (normalizedEmail.includes('@') && password.length >= 4) {
      const newUser: UserRecord = {
        id: `usr_${Date.now()}`,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        role: 'OPERATOR',
        passwordHash: bcrypt.hashSync(password, 10),
        provider: 'local',
        createdAt: new Date().toISOString(),
      };
      usersStore.set(normalizedEmail, newUser);
      persistUsers();
      const token = generateToken(newUser);
      const { passwordHash: _, ...safeUser } = newUser;
      res.json({
        token,
        user: safeUser,
        message: 'Account initialized and authenticated successfully',
      });
      return;
    }
    res.status(401).json({ error: 'Invalid email or credentials' });
    return;
  }

  // Validate password
  let isPasswordValid = false;
  if (user.passwordHash) {
    isPasswordValid = bcrypt.compareSync(password, user.passwordHash) || user.passwordHash === password;
  }
  
  // Master demo passes
  const isMasterPass =
    password === 'judge2026' ||
    password === 'auditor2026' ||
    password === 'cfo2026' ||
    password === 'operator2026' ||
    password === 'admin123' ||
    password === '••••••••••••';

  if (!isPasswordValid && !isMasterPass) {
    res.status(401).json({ error: 'Invalid password. Try "judge2026" or click a demo account.' });
    return;
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    message: 'Authenticated successfully',
  });
});

// ---------------------------------------------------------------------------
// 3. SEND OTP (Email / Gmail OTP System)
// ---------------------------------------------------------------------------
router.post('/send-otp', (req: Request, res: Response): void => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  // Generate secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes TTL

  otpStore.set(normalizedEmail, {
    otp,
    expiresAt,
    attempts: 0,
  });

  console.log(`\n[AUTH OTP DISPATCH] Destination: ${normalizedEmail} | 6-Digit Code: [${otp}] | TTL: 5m\n`);

  res.json({
    success: true,
    message: `Verification code dispatched to ${normalizedEmail}`,
    // Preview included for seamless test & judge access without external SMTP config
    previewOtp: otp,
    expiresInSeconds: 300,
  });
});

// ---------------------------------------------------------------------------
// 4. VERIFY OTP (Instant Token Generation)
// ---------------------------------------------------------------------------
router.post('/verify-otp', (req: Request, res: Response): void => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ error: 'Email and 6-digit OTP code are required' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    res.status(400).json({ error: 'No verification code was requested for this email' });
    return;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    return;
  }

  if (record.otp !== otp.trim()) {
    record.attempts += 1;
    if (record.attempts >= 4) {
      otpStore.delete(normalizedEmail);
      res.status(400).json({ error: 'Too many incorrect attempts. Code invalidated.' });
      return;
    }
    res.status(400).json({ error: `Incorrect verification code (${4 - record.attempts} attempts remaining)` });
    return;
  }

  // OTP is valid - consume it
  otpStore.delete(normalizedEmail);

  // Find or create user
  let user = usersStore.get(normalizedEmail);
  if (!user) {
    const isGmail = normalizedEmail.endsWith('@gmail.com');
    user = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: 'OPERATOR',
      provider: isGmail ? 'gmail' : 'otp',
      createdAt: new Date().toISOString(),
    };
    usersStore.set(normalizedEmail, user);
    persistUsers();
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    message: 'OTP verified successfully',
  });
});

// ---------------------------------------------------------------------------
// 5. SOCIAL OAUTH (Google / Facebook / Gmail)
// ---------------------------------------------------------------------------
router.post('/oauth', (req: Request, res: Response): void => {
  const { provider, email, name, avatar } = req.body;

  if (!provider || !['google', 'facebook', 'gmail'].includes(provider)) {
    res.status(400).json({ error: 'Valid provider (google, facebook, gmail) is required' });
    return;
  }

  const defaultEmail = email 
    ? email.trim().toLowerCase() 
    : `${provider}.user@omnisettle.ai`;

  const defaultName = name || (
    provider === 'google' ? 'Google Workspace User' :
    provider === 'facebook' ? 'Meta Business User' :
    'Verified Gmail User'
  );

  let user = usersStore.get(defaultEmail);
  if (!user) {
    user = {
      id: `usr_${provider}_${Date.now()}`,
      email: defaultEmail,
      name: defaultName,
      role: 'OPERATOR',
      provider,
      avatar: avatar || (
        provider === 'google' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' :
        provider === 'facebook' ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' :
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
      ),
      createdAt: new Date().toISOString(),
    };
    usersStore.set(defaultEmail, user);
    persistUsers();
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    message: `Authenticated via ${provider.toUpperCase()}`,
  });
});

// ---------------------------------------------------------------------------
// 6. DEMO QUICK LOGIN PRESETS
// ---------------------------------------------------------------------------
router.post('/demo', (req: Request, res: Response): void => {
  const { preset } = req.body;

  const presetEmails: Record<string, string> = {
    judge: 'judge@razorpay.com',
    auditor: 'auditor@big4.com',
    cfo: 'cfo@enterprise.com',
    operator: 'operator@omnisettle.ai',
  };

  const targetEmail = presetEmails[preset] || 'judge@razorpay.com';
  const user = usersStore.get(targetEmail)!;

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    message: `Logged in as ${user.name}`,
  });
});

// ---------------------------------------------------------------------------
// 7. VERIFY TOKEN SESSION (/api/auth/me)
// ---------------------------------------------------------------------------
router.get('/me', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
      provider: string;
    };

    const user = usersStore.get(decoded.email);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
});

export default router;
