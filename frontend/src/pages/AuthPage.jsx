import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineExclamationCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => {
      const timeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => setIsPurpleBlinking(false), 150);
        scheduleBlink();
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => {
      const timeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => setIsBlackBlinking(false), 150);
        scheduleBlink();
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  useEffect(() => {
    if (form.password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const t = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return t;
      };
      const p = schedulePeek();
      return () => clearTimeout(p);
    }
  }, [form.password, showPassword]);

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        toast.success('Welcome back!');
        const isAdm = form.email.toLowerCase().includes('admin') || form.password === 'admin123';
        navigate(isAdm ? '/admin' : '/');
      } else {
        await signUp(form.email, form.password, form.name);
        toast.success('Account created!');
        navigate('/');
      }
    } catch (err) {
      const errorStr = err.code || err.message || '';
      if (mode === 'login' && (errorStr.includes('user-not-found') || errorStr.includes('invalid-credential'))) {
        setShowSignupModal(true);
      } else {
        toast.error(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  const switchToSignup = () => {
    setShowSignupModal(false);
    setMode('register');
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error('Please enter your email first');
      return;
    }
    try {
      await resetPassword(form.email);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="h-screen overflow-hidden grid lg:grid-cols-2 bg-white">
      {/* Cartoon Characters Side */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gray-900 p-8 overflow-hidden">
        <div className="relative z-20">
          <Link to="/" className="flex items-center gap-2 text-md font-bold text-white tracking-widest uppercase">
            <div className="size-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-3 text-white" />
            </div>
            <span>ARNIKA</span>
          </Link>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[400px]">
          <div className="relative" style={{ width: '450px', height: '320px' }}>
            {/* Characters implementation from prompt */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '60px',
                width: '150px',
                height: (isTyping || (form.password.length > 0 && !showPassword)) ? '350px' : '320px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: (form.password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (form.password.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: (form.password.length > 0 && showPassword) ? `${18}px` : isLookingAtEachOther ? `${45}px` : `${38 + purplePos.faceX}px`,
                  top: (form.password.length > 0 && showPassword) ? `${30}px` : isLookingAtEachOther ? `${55}px` : `${35 + purplePos.faceY}px`,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isPurpleBlinking} forceLookX={(form.password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(form.password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isPurpleBlinking} forceLookX={(form.password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(form.password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '200px',
                width: '100px',
                height: '250px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: (form.password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (form.password.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-5 transition-all duration-700 ease-in-out"
                style={{
                  left: (form.password.length > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${28}px` : `${22 + blackPos.faceX}px`,
                  top: (form.password.length > 0 && showPassword) ? `${25}px` : isLookingAtEachOther ? `${10}px` : `${28 + blackPos.faceY}px`,
                }}
              >
                <EyeBall size={14} pupilSize={5} maxDistance={3} isBlinking={isBlackBlinking} forceLookX={(form.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} />
                <EyeBall size={14} pupilSize={5} maxDistance={3} isBlinking={isBlackBlinking} forceLookX={(form.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} />
              </div>
            </div>

            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '200px',
                height: '160px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '100px 100px 0 0',
                transform: (form.password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div className="absolute flex gap-7" style={{ left: (form.password.length > 0 && showPassword) ? `${40}px` : `${72 + orangePos.faceX}px`, top: (form.password.length > 0 && showPassword) ? `${75}px` : `${80 + orangePos.faceY}px` }}>
                <Pupil size={10} forceLookX={(form.password.length > 0 && showPassword) ? -5 : undefined} />
                <Pupil size={10} forceLookX={(form.password.length > 0 && showPassword) ? -5 : undefined} />
              </div>
            </div>

            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '260px',
                width: '120px',
                height: '190px',
                backgroundColor: '#E8D754',
                borderRadius: '60px 60px 0 0',
                zIndex: 4,
                transform: (form.password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div className="absolute flex gap-5" style={{ left: (form.password.length > 0 && showPassword) ? `${18}px` : `${42 + yellowPos.faceX}px`, top: (form.password.length > 0 && showPassword) ? `${35}px` : `${35 + yellowPos.faceY}px` }}>
                <Pupil size={10} forceLookX={(form.password.length > 0 && showPassword) ? -5 : undefined} />
                <Pupil size={10} forceLookX={(form.password.length > 0 && showPassword) ? -5 : undefined} />
              </div>
              <div className="absolute w-16 h-[3px] bg-[#2D2D2D] rounded-full" style={{ left: (form.password.length > 0 && showPassword) ? `${10}px` : `${32 + yellowPos.faceX}px`, top: `75px` }} />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
           <span>Premium Quality</span>
           <span>Exclusive Designs</span>
           <span>© 2026 Arnika</span>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(108,63,245,0.15),transparent)] pointer-events-none" />
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[360px]">
           <div className="mb-6">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">
                 {mode === 'login' ? 'SIGN IN' : 'JOIN US'}
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Experience premium lifestyle</p>
              
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, email: 'admin@arnika.com', password: 'admin123' }))}
                  className="w-full py-2 px-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-center justify-between text-amber-900 hover:bg-amber-100 transition-colors"
                  title="Click to autofill admin login"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">⚡ Fill Admin Login</span>
                  <span className="text-[10px] font-mono text-amber-700">admin@arnika.com / admin123</span>
                </button>
              )}
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-1.5">
                    <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</Label>
                    <Input 
                      placeholder="Enter your name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold focus:bg-white transition-all px-5"
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold focus:bg-white transition-all px-5"
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Password</Label>
                  {mode === 'login' && <button type="button" onClick={handleForgotPassword} className="text-[9px] font-bold text-gray-900 uppercase tracking-widest hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    className="h-12 rounded-xl bg-gray-50 border-gray-100 font-bold focus:bg-white transition-all px-5 pr-12"
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all">
                {loading ? "PLEASE WAIT..." : mode === 'login' ? "SIGN IN" : "CREATE ACCOUNT"}
              </Button>

              <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                 <div className="relative flex justify-center"><span className="bg-white px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Or continue with</span></div>
              </div>

              <Button type="button" onClick={handleGoogle} variant="outline" className="w-full h-14 rounded-2xl border-gray-100 bg-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                <FcGoogle size={20} />
                Google
              </Button>
           </form>

           <p className="text-center mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {mode === 'login' ? "New to Arnika?" : "Already have an account?"}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="ml-2 text-gray-900 hover:underline">
                 {mode === 'login' ? "JOIN NOW" : "SIGN IN"}
              </button>
           </p>
        </div>
      </div>

      <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} title="Security Protocol">
         <div className="text-center p-6">
            <HiOutlineExclamationCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Access Denied</h2>
            <p className="text-gray-500 text-sm font-medium mb-8">Identifier not found in our encrypted database. Would you like to create a new session?</p>
            <div className="space-y-4">
               <Button className="w-full h-14 rounded-2xl" onClick={switchToSignup}>Create Secure Account</Button>
               <button onClick={() => setShowSignupModal(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">Try Alternative</button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
