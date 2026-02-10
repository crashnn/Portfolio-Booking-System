import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import API_URL from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        navigate('/admin/projects');
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Sunucu hatası');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-dark">Admin Girişi</h2>
          <p className="text-gray-400">Panele erişmek için giriş yapın.</p>
        </div>

        {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kullanıcı Adı</label>
            <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input 
                    type="text" 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input 
                    type="password" 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
          </div>

          <button className="w-full py-4 bg-dark text-white font-bold rounded-xl hover:bg-primary transition shadow-lg mt-4">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;