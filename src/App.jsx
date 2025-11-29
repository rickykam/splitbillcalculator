import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Users, Receipt, Calculator, UserPlus, DollarSign, ArrowRight, X, Edit2, Check, ChevronRight, ArrowLeft, Calendar, ShoppingBag, Camera, Image as ImageIcon, Maximize2, RefreshCw, CreditCard, Copy, Loader2, Power, AlertCircle, Globe } from 'lucide-react';

// ==========================================
// 0. 翻譯字典 (Translations)
// ==========================================
const TRANSLATIONS = {
  zh: {
    appTitle: '分帳計算器',
    tabActivity: '活動',
    tabMembers: '成員',
    tabExpenses: '帳目',
    tabReport: '結算',
    newActivityBtn: '新活動',
    createActivity: '建立新活動',
    editActivity: '編輯活動',
    activityName: '活動名稱',
    activityDate: '日期',
    exampleActivity: '例如：東京五天四夜',
    noActivity: '還沒有任何活動',
    createFirst: '建立第一個活動',
    addMember: '新增成員',
    enterName: '輸入名字',
    addBtn: '新增成員',
    enterPayId: '輸入 PayID / 轉帳資訊 (選填)',
    set: '已設定',
    cannotDeleteUser: '無法刪除',
    userInUse: '該使用者有相關帳目，無法刪除。',
    nameLabel: '名稱',
    payIdLabel: 'PayID',
    noExpenses: '尚無帳目',
    addExpense: '新增帳目',
    editExpense: '編輯帳目',
    itemName: '項目名稱',
    exampleItem: '例如：牛肉麵',
    whoPaid: '誰先付錢？',
    newMember: '新成員',
    splitAmong: '分給誰？',
    selectAll: '全選',
    cancelAll: '全部取消',
    camera: '拍照',
    album: '相簿',
    deleteExpense: '刪除此帳目',
    continueAdd: '繼續新增',
    complete: '完成',
    saveChanges: '儲存修改',
    totalSpending: '總支出',
    settlementPlan: '結算方案',
    noTransfer: '無需轉帳',
    personalDetail: '個人帳務詳情',
    paid: '已付',
    share: '應付',
    net: '淨結餘',
    copied: '已複製',
    copy: '複製',
    cameraTitle: '拍攝單據',
    startCamera: '啟動相機',
    initCamera: '正在初始化相機...',
    alignReceipt: '將單據置於框內',
    cameraError: '無法啟動相機，請確認權限。',
    browserNoSupport: '您的瀏覽器不支援相機功能。',
    alertTitle: '提示',
    confirmTitle: '確認',
    cancel: '取消',
    save: '儲存',
    delete: '刪除',
    confirmDelete: '確定刪除',
    deleteWarning: '確定要刪除嗎？此動作無法復原。',
    ok: '知道了',
    errItemName: '請輸入項目名稱',
    errTotalZero: '帳目總數不能為 0',
    errNoSplitter: '請至少選擇一位分攤者',
    errGroupInput: '請輸入活動名稱與日期',
    errNameExist: '該名字已存在',
    close: '關閉',
    retry: '重試',
  },
  en: {
    appTitle: 'Split Bill Calculator',
    tabActivity: 'Activity',
    tabMembers: 'Members',
    tabExpenses: 'Expenses',
    tabReport: 'Report',
    newActivityBtn: 'New',
    createActivity: 'New Activity',
    editActivity: 'Edit Activity',
    activityName: 'Activity Name',
    activityDate: 'Date',
    exampleActivity: 'e.g. Tokyo Trip',
    noActivity: 'No activities yet',
    createFirst: 'Create your first activity',
    addMember: 'Add Member',
    enterName: 'Enter name',
    addBtn: 'Add Member',
    enterPayId: 'Enter PayID / Info (Optional)',
    set: 'Set',
    cannotDeleteUser: 'Cannot Delete',
    userInUse: 'User has related expenses.',
    nameLabel: 'Name',
    payIdLabel: 'PayID',
    noExpenses: 'No expenses yet',
    addExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    itemName: 'Item Name',
    exampleItem: 'e.g. Dinner',
    whoPaid: 'Who Paid?',
    newMember: 'New',
    splitAmong: 'Split Among',
    selectAll: 'All',
    cancelAll: 'None',
    camera: 'Camera',
    album: 'Album',
    deleteExpense: 'Delete Expense',
    continueAdd: 'Save & Add',
    complete: 'Done',
    saveChanges: 'Save Changes',
    totalSpending: 'Total',
    settlementPlan: 'Settlement Plan',
    noTransfer: 'Settled',
    personalDetail: 'Personal Details',
    paid: 'Paid',
    share: 'Share',
    net: 'Net',
    copied: 'Copied',
    copy: 'Copy',
    cameraTitle: 'Scan Receipt',
    startCamera: 'Start Camera',
    initCamera: 'Initializing...',
    alignReceipt: 'Align receipt in frame',
    cameraError: 'Camera failed. Check permissions.',
    browserNoSupport: 'Browser does not support camera.',
    alertTitle: 'Alert',
    confirmTitle: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirmDelete: 'Delete',
    deleteWarning: 'Are you sure? This cannot be undone.',
    ok: 'OK',
    errItemName: 'Please enter item name',
    errTotalZero: 'Total amount cannot be 0',
    errNoSplitter: 'Select at least one person',
    errGroupInput: 'Please enter name and date',
    errNameExist: 'Name already exists',
    close: 'Close',
    retry: 'Retry',
  }
};

// ==========================================
// 1. 通用 UI 元件
// ==========================================

const ValidationAlert = ({ message, onClose, t }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs relative z-10 text-center transform scale-100">
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{t('alertTitle')}</h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed whitespace-pre-line">{message}</p>
        <button 
          onClick={onClose} 
          className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl active:scale-95 transition-transform"
        >
          {t('ok')}
        </button>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ title, message, onConfirm, onCancel, t }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel}></div>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs relative z-10 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-transform"
          >
            {t('confirmDelete')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 獨立相機元件 (CameraCapture)
// ==========================================
const CameraCapture = ({ onCapture, onClose, t }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    if (status === 'requesting') return; 
    setStatus('requesting');
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('error');
      setError(t('browserNoSupport'));
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (!mountedRef.current) {
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }

      setStream(mediaStream);
      setStatus('streaming');
      
      setTimeout(async () => {
        if (videoRef.current && mountedRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.muted = true;
          try {
            await videoRef.current.play();
            if (mountedRef.current) setIsReady(true);
          } catch (playErr) {
            console.warn("Auto-play blocked:", playErr);
            if (mountedRef.current) setIsReady(true); 
          }
        }
      }, 200);
    } catch (err) {
      console.error("Camera error:", err);
      if (mountedRef.current) {
        setStatus('error');
        setError(t('cameraError'));
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.85);
      if (stream) stream.getTracks().forEach(track => track.stop());
      onCapture(imageData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="flex justify-between items-center p-4 z-20 bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0">
        <button onClick={onClose} className="text-white p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"><X className="w-6 h-6" /></button>
        <span className="text-white font-bold tracking-wider drop-shadow-md">{t('cameraTitle')}</span>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 relative bg-gray-900 overflow-hidden flex items-center justify-center">
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center z-30 p-6 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-600">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-all flex items-center gap-2">
              <Power className="w-5 h-5" /> {t('startCamera')}
            </button>
          </div>
        )}
        {status === 'requesting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/80">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-3" />
            <p className="text-sm font-medium">{t('initCamera')}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-6 text-center bg-black/90">
            <p className="mb-4 text-4xl">🚫</p>
            <p className="text-lg font-medium mb-6">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm">{t('close')}</button>
          </div>
        )}
        <video ref={videoRef} playsInline muted autoPlay className={`absolute min-w-full min-h-full object-cover transition-opacity duration-500 z-0 ${isReady && status === 'streaming' ? 'opacity-100' : 'opacity-0'}`} />
        {isReady && status === 'streaming' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
             <div className="w-[75%] h-[75%] border-2 border-white/40 rounded-lg relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
               <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white -mt-1 -mr-1"></div>
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -mb-1 -ml-1"></div>
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>
               <div className="absolute -top-10 left-0 right-0 text-center text-white/90 text-xs bg-black/50 py-1 rounded-full">{t('alignReceipt')}</div>
             </div>
          </div>
        )}
      </div>
      {isReady && status === 'streaming' && (
        <div className="bg-black pb-safe pt-6 pb-8 flex justify-center z-20">
          <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white bg-white/10 active:bg-white/30 active:scale-95 transition-all flex items-center justify-center cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// ==========================================
// 3. 獨立帳目編輯視窗 (ExpenseFormModal)
// ==========================================
const ExpenseFormModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  users, 
  onSave,   
  onDelete, 
  onAddUser,
  t 
}) => {
  const [title, setTitle] = useState('');
  const [paymentBreakdown, setPaymentBreakdown] = useState({});
  const [splitAmong, setSplitAmong] = useState([]);
  const [image, setImage] = useState(null);
  
  const [showCamera, setShowCamera] = useState(false);
  const [showInlineAddUser, setShowInlineAddUser] = useState(false);
  const [inlineUserName, setInlineUserName] = useState('');
  const galleryInputRef = useRef(null);

  const [alertMsg, setAlertMsg] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        const pb = {};
        users.forEach(u => pb[u] = initialData.paidBy[u] || '');
        setPaymentBreakdown(pb);
        setSplitAmong(initialData.splitAmong);
        setImage(initialData.image || null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData, users]);

  const resetForm = () => {
    setTitle('');
    setPaymentBreakdown(users.reduce((acc, u) => ({ ...acc, [u]: '' }), {}));
    setSplitAmong([...users]); 
    setImage(null);
  };

  const handleSave = (shouldClose) => {
    if (!title || title.trim() === '') {
      setAlertMsg(t('errItemName'));
      return;
    }
    let total = 0;
    const finalPaidBy = {};
    Object.entries(paymentBreakdown).forEach(([user, amount]) => {
      const val = parseFloat(amount);
      if (val > 0) {
        finalPaidBy[user] = val;
        total += val;
      }
    });
    if (total <= 0) {
      setAlertMsg(t('errTotalZero'));
      return;
    }
    if (splitAmong.length === 0) {
      setAlertMsg(t('errNoSplitter'));
      return;
    }
    const expenseData = {
      id: initialData ? initialData.id : Date.now(),
      title,
      total,
      paidBy: finalPaidBy,
      splitAmong,
      image
    };
    onSave(expenseData, shouldClose);
    if (!shouldClose) {
      setTitle('');
      setPaymentBreakdown(users.reduce((acc, u) => ({ ...acc, [u]: '' }), {}));
      setImage(null);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (initialData) {
      onDelete(initialData.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleInlineAddUserSubmit = () => {
    const name = inlineUserName.trim();
    if (name) {
      if (onAddUser(name)) {
        setSplitAmong(prev => [...prev, name]);
        setPaymentBreakdown(prev => ({ ...prev, [name]: '' }));
        setInlineUserName('');
        setShowInlineAddUser(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end sm:justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-[90%] sm:max-w-md sm:mx-auto sm:rounded-t-2xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b flex justify-between items-center shadow-sm shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{initialData ? t('editExpense') : t('addExpense')}</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Image */}
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-4 flex flex-col items-center justify-center relative">
            {image ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                  <img src={image} alt="Receipt" className="w-full h-full object-contain bg-black/5" />
                  <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="w-full flex gap-3">
                <button type="button" onClick={() => setShowCamera(true)} className="flex-1 py-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors"><Camera className="w-6 h-6 text-blue-600" /><span className="text-sm font-bold text-blue-700">{t('camera')}</span></button>
                <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-1 py-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"><ImageIcon className="w-6 h-6 text-gray-600" /><span className="text-sm font-bold text-gray-700">{t('album')}</span></button>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" ref={galleryInputRef} onChange={handleImageSelect} />
          </div>

          {/* Name */}
          <div className={`bg-white p-4 rounded-xl shadow-sm mb-4 border ${!title && 'border-red-300'} border-gray-100`}>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{t('itemName')} <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('exampleItem')} className="w-full text-xl font-medium border-b border-gray-200 focus:outline-none focus:border-blue-500 py-2" />
          </div>

          {/* Payer */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('whoPaid')}</label>
              {!showInlineAddUser ? (
                <button onClick={() => setShowInlineAddUser(true)} className="text-xs text-blue-600 font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"><Plus className="w-3 h-3" /> {t('newMember')}</button>
              ) : (
                <div className="flex items-center gap-2 animate-in fade-in duration-200">
                  <input className="w-24 text-sm border border-blue-300 rounded px-2 py-1 outline-none" placeholder={t('enterName')} value={inlineUserName} onChange={(e) => setInlineUserName(e.target.value)} autoFocus />
                  <button onClick={handleInlineAddUserSubmit} className="text-green-600 bg-green-50 p-1 rounded hover:bg-green-100"><Check className="w-4 h-4"/></button>
                  <button onClick={() => setShowInlineAddUser(false)} className="text-red-500 bg-red-50 p-1 rounded hover:bg-red-100"><X className="w-4 h-4"/></button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium w-1/3 truncate text-sm">{user}</span>
                  <div className="relative w-2/3">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={paymentBreakdown[user] || ''} 
                      onChange={(e) => setPaymentBreakdown({...paymentBreakdown, [user]: e.target.value})} 
                      className="w-full bg-gray-50 rounded-lg py-2 pl-7 pr-3 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-20 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('splitAmong')}</label>
              <button onClick={() => setSplitAmong(splitAmong.length === users.length ? [] : [...users])} className="text-xs text-blue-500 font-medium">{splitAmong.length === users.length ? t('cancelAll') : t('selectAll')}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {users.map(user => (
                <button key={user} onClick={() => setSplitAmong(splitAmong.includes(user) ? splitAmong.filter(u => u !== user) : [...splitAmong, user])} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${splitAmong.includes(user) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{user}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-white border-t pb-safe shrink-0 flex gap-3">
          {initialData ? (
            <>
              <button onClick={handleDelete} className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100"><Trash2 className="w-5 h-5" /> {t('delete')}</button>
              <button onClick={() => handleSave(true)} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-700"><Check className="w-5 h-5" /> {t('saveChanges')}</button>
            </>
          ) : (
            <>
              <button onClick={() => handleSave(false)} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 border border-blue-100 hover:bg-blue-100"><Plus className="w-5 h-5" /> {t('continueAdd')}</button>
              <button onClick={() => handleSave(true)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-700"><Check className="w-5 h-5" /> {t('complete')}</button>
            </>
          )}
        </div>
      </div>

      {alertMsg && <ValidationAlert message={alertMsg} onClose={() => setAlertMsg(null)} t={t} />}
      {showDeleteConfirm && <ConfirmDialog title={t('confirmTitle')} message={t('deleteWarning')} onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} t={t} />}
      {showCamera && <CameraCapture onCapture={(imgData) => { setImage(imgData); setShowCamera(false); }} onClose={() => setShowCamera(false)} t={t} />}
    </div>
  );
};

// ==========================================
// 4. 主程式 (Main App)
// ==========================================
const SplitBillApp = () => {
  // 安全讀取 LocalStorage 函式
  const safeParseJSON = (key, defaultValue) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const [lang, setLang] = useState(() => {
    const savedLang = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : 'zh';
    return (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
  });

  const [currentView, setCurrentView] = useState('GROUPS'); 
  const [activeTab, setActiveTab] = useState('expenses'); 
  
  // Persist state with Safety
  const [users, setUsers] = useState(() => safeParseJSON('users', ['Member A', 'Member B'])); 
  const [payIds, setPayIds] = useState(() => safeParseJSON('payIds', {}));
  const [groups, setGroups] = useState(() => safeParseJSON('groups', []));
  const [expenses, setExpenses] = useState(() => safeParseJSON('expenses', []));
  
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('payIds', JSON.stringify(payIds)); }, [payIds]);
  useEffect(() => { localStorage.setItem('groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);

  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');
  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['zh'];
    return dict[key] || key;
  };

  // Modal Control
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null); 
  const [groupTitleInput, setGroupTitleInput] = useState('');
  const [groupDateInput, setGroupDateInput] = useState('');
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserPayId, setNewUserPayId] = useState(''); // New state for inline adding payid
  const [editingUser, setEditingUser] = useState(null);
  const [editUserNameInput, setEditUserNameInput] = useState('');
  const [editUserPayIdInput, setEditUserPayIdInput] = useState(''); 
  const [viewingImage, setViewingImage] = useState(null);
  const [userAlertMsg, setUserAlertMsg] = useState(null);
  const [showGroupDeleteConfirm, setShowGroupDeleteConfirm] = useState(null); // store group id

  // Helpers
  const currentGroup = groups.find(g => g.id === selectedGroupId);
  const currentGroupExpenses = useMemo(() => {
    if (!selectedGroupId) return [];
    return expenses.filter(e => e.groupId === selectedGroupId);
  }, [expenses, selectedGroupId]);

  // Actions
  const handleSaveExpense = (data, shouldClose) => {
    const expensePayload = { ...data, groupId: selectedGroupId };
    if (editingExpenseId) {
      setExpenses(prev => prev.map(e => e.id === editingExpenseId ? { ...e, ...expensePayload } : e));
    } else {
      setExpenses(prev => [...prev, expensePayload]);
    }
    if (shouldClose) {
      setIsExpenseModalOpen(false);
      setEditingExpenseId(null);
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // 修正：新增成員函式定義
  const handleAddUser = (name) => { 
    const n = name.trim(); 
    if(n && !users.includes(n)) { setUsers([...users, n]); return true; } 
    return false; 
  };

  const handleGlobalAddUser = () => { 
    const name = newUserName.trim();
    if(handleAddUser(name)) {
       if(newUserPayId.trim()) {
          setPayIds(prev => ({...prev, [name]: newUserPayId.trim()}));
       }
       setNewUserName('');
       setNewUserPayId('');
    }
  };
  
  const startEditUser = (u) => { 
    setEditingUser(u); 
    setEditUserNameInput(u); 
    setEditUserPayIdInput(payIds[u]||''); 
  };

  const saveEditUser = () => {
     const oldN = editingUser; const newN = editUserNameInput.trim();
     if (!newN || newN === oldN) { if(newN) setPayIds({...payIds, [newN]: editUserPayIdInput}); setEditingUser(null); return; }
     if(users.includes(newN)) { setUserAlertMsg(t('errNameExist')); return; }
     setUsers(users.map(u=>u===oldN?newN:u));
     const newP = {...payIds}; delete newP[oldN]; newP[newN] = editUserPayIdInput; setPayIds(newP);
     setExpenses(prev => prev.map(e => {
       const pb = {...e.paidBy}; if(pb[oldN]){pb[newN]=pb[oldN]; delete pb[oldN];}
       const sa = e.splitAmong.map(s=>s===oldN?newN:s);
       return {...e, paidBy:pb, splitAmong:sa};
     }));
     setEditingUser(null);
  };
  
  const removeUser = (u) => {
    if(expenses.some(e=>e.paidBy[u]>0||e.splitAmong.includes(u))) { setUserAlertMsg(t('userInUse')); return; }
    setUsers(users.filter(x=>x!==u));
    const newP = {...payIds}; delete newP[u]; setPayIds(newP);
  };

  const openAddGroup = () => { setEditingGroupId(null); setGroupTitleInput(''); setGroupDateInput(new Date().toISOString().split('T')[0]); setIsGroupModalOpen(true); };
  const openEditGroup = (g) => { setEditingGroupId(g.id); setGroupTitleInput(g.title); setGroupDateInput(new Date(g.date).toISOString().split('T')[0]); setIsGroupModalOpen(true); };
  
  const saveGroup = () => {
    if(!groupTitleInput.trim()) { setUserAlertMsg(t('errGroupInput')); return; }
    const d = new Date(groupDateInput).toISOString();
    if(editingGroupId) setGroups(prev=>prev.map(g=>g.id===editingGroupId?{...g, title:groupTitleInput, date:d}:g));
    else { const g={id:Date.now(), title:groupTitleInput, date:d}; setGroups([g,...groups]); setSelectedGroupId(g.id); setCurrentView('GROUP_DETAIL'); }
    setIsGroupModalOpen(false);
  };
  
  const confirmGroupDelete = () => {
    if (showGroupDeleteConfirm) {
      setGroups(groups.filter(g=>g.id!==showGroupDeleteConfirm));
      setExpenses(expenses.filter(x=>x.groupId!==showGroupDeleteConfirm));
      setShowGroupDeleteConfirm(null);
    }
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setUserAlertMsg(`${t('copied')}: ${text}`);
    } catch (err) {
      console.error('Copy failed', err);
    }
    
    document.body.removeChild(textArea);
  };

  const report = useMemo(() => {
    const stats = {}; users.forEach(u => stats[u] = { paid: 0, share: 0, net: 0 });
    let totalSpending = 0;
    currentGroupExpenses.forEach(e => {
      totalSpending += e.total;
      const share = e.total / e.splitAmong.length;
      e.splitAmong.forEach(u => { if(stats[u]) { stats[u].share += share; stats[u].net -= share; } });
      Object.entries(e.paidBy).forEach(([u, amt]) => { if(stats[u]) { stats[u].paid += amt; stats[u].net += amt; } });
    });
    const d=[], c=[];
    Object.entries(stats).forEach(([u, s]) => {
       if(s.net < -0.01) d.push({user:u, val:s.net});
       if(s.net > 0.01) c.push({user:u, val:s.net});
    });
    d.sort((a,b)=>a.val-b.val); c.sort((a,b)=>b.val-a.val);
    const tx=[]; let i=0,j=0;
    while(i<d.length && j<c.length){
      const amt = Math.min(Math.abs(d[i].val), c[j].val);
      // 修正：這裡的 map callback 參數改名為 txItem，避免與翻譯函式 t 衝突
      tx.push({from:d[i].user, to:c[j].user, amount:amt.toFixed(1), payId:payIds[c[j].user]});
      d[i].val += amt; c[j].val -= amt;
      if(Math.abs(d[i].val)<0.01)i++; if(Math.abs(c[j].val)<0.01)j++;
    }
    return { stats, tx, totalSpending };
  }, [users, currentGroupExpenses, payIds]);

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white px-5 py-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        {currentView === 'GROUP_DETAIL' ? (
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedGroupId(null); setCurrentView('GROUPS'); }} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6" /></button>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">{currentGroup?.title}</h1>
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(currentGroup?.date).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><div className="bg-blue-600 p-1.5 rounded-lg"><Calculator className="w-4 h-4 text-white" /></div> {t('appTitle')}</h1>
        )}
        <div className="flex items-center gap-2">
           {currentView === 'GROUPS' && <button onClick={openAddGroup} className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg">{t('newActivityBtn')}</button>}
           <button onClick={toggleLang} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
             <Globe className="w-5 h-5 text-gray-600"/>
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
        {currentView === 'GROUPS' && (
           <div className="p-4 space-y-4">
             {groups.length === 0 ? <div className="flex flex-col items-center justify-center h-64 text-gray-400"><ShoppingBag className="w-16 h-16 mb-4 opacity-20" /><p>{t('noActivity')}</p><button onClick={openAddGroup} className="mt-4 text-blue-600 font-bold underline">{t('createFirst')}</button></div> : groups.map(g => {
               const tot = expenses.filter(e=>e.groupId===g.id).reduce((s,x)=>s+x.total,0);
               return (
                 <div key={g.id} onClick={() => { setSelectedGroupId(g.id); setCurrentView('GROUP_DETAIL'); }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform relative group">
                   <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-gray-800">{g.title}</h3>
                     <div className="flex gap-1">
                        <button onClick={(e)=>{e.stopPropagation(); openEditGroup(g)}} className="p-1 text-gray-300 hover:text-blue-500"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={(e)=>{e.stopPropagation(); setShowGroupDeleteConfirm(g.id)}} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   </div>
                   <div className="flex justify-between items-end text-sm text-gray-400"><p>{new Date(g.date).toLocaleDateString()}</p><span className="font-bold text-xl text-blue-600">${tot.toFixed(0)}</span></div>
                 </div>
               );
             })}
           </div>
        )}

        {currentView === 'FRIENDS' && (
          <div className="p-4 space-y-3">
             {/* Add Member Card */}
             <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                <div className="flex flex-col gap-3">
                  <input 
                    className="bg-gray-50 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-blue-100 transition-colors" 
                    placeholder={t('enterName')} 
                    value={newUserName} 
                    onChange={e=>setNewUserName(e.target.value)}
                  />
                  <input 
                    className="bg-gray-50 rounded-xl px-4 py-3 outline-none border border-transparent focus:border-blue-100 transition-colors font-mono text-sm" 
                    placeholder={t('enterPayId')} 
                    value={newUserPayId} 
                    onChange={e=>setNewUserPayId(e.target.value)}
                  />
                  <button 
                    onClick={handleGlobalAddUser} 
                    className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold w-full mt-1 active:scale-[0.98] transition-transform shadow-md shadow-blue-100"
                  >
                    {t('addBtn')}
                  </button>
                </div>
             </div>

             {/* Members List */}
             {users.map(u => (
               <div key={u} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                 {editingUser === u ? (
                   <div className="flex-1 flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-12">{t('nameLabel')}</span>
                        <input className="flex-1 border-b p-1 outline-none" value={editUserNameInput} onChange={e=>setEditUserNameInput(e.target.value)} autoFocus />
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-12">{t('payIdLabel')}</span>
                        <input className="flex-1 border-b p-1 text-sm font-mono outline-none" value={editUserPayIdInput} onChange={e=>setEditUserPayIdInput(e.target.value)} placeholder={t('enterPayId')} />
                     </div>
                     <div className="flex justify-end gap-2"><button onClick={()=>setEditingUser(null)} className="text-gray-400 text-xs">{t('cancel')}</button><button onClick={saveEditUser} className="text-blue-600 font-bold text-xs">{t('save')}</button></div>
                   </div>
                 ) : (
                   <>
                     <div>
                       <div className="font-medium text-gray-700 flex items-center gap-2">{u} {payIds[u] && <span className="text-[10px] bg-gray-100 px-1 rounded border"><CreditCard className="w-3 h-3 inline"/></span>}</div>
                       {payIds[u] && <div className="text-xs text-gray-400 font-mono">{payIds[u]}</div>}
                     </div>
                     <div className="flex gap-1">
                       <button onClick={()=>startEditUser(u)} className="p-2 text-gray-300 hover:text-blue-500"><Edit2 className="w-4 h-4"/></button>
                       <button onClick={()=>removeUser(u)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   </>
                 )}
               </div>
             ))}
          </div>
        )}

        {currentView === 'GROUP_DETAIL' && (
          <>
            {activeTab === 'expenses' && (
               <div className="p-4 space-y-4">
                 {currentGroupExpenses.map(e => (
                   <div key={e.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.99] transition-transform cursor-pointer" onClick={() => { setEditingExpenseId(e.id); setIsExpenseModalOpen(true); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 overflow-hidden border border-gray-100">
                          {e.image ? <img src={e.image} className="w-full h-full object-cover" /> : <Receipt className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{e.title}</h3>
                          <div className="text-xs text-gray-500">{t('paid')}: {Object.keys(e.paidBy).filter(k=>e.paidBy[k]>0).map(k=>`${k}`).join(', ')}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="font-bold text-blue-600 text-lg">${e.total.toFixed(1)}</span>
                         <div className="text-gray-300"><Edit2 size={14}/></div>
                      </div>
                   </div>
                 ))}
                 {currentGroupExpenses.length === 0 && <div className="text-center py-20 text-gray-400 flex flex-col items-center"><Receipt size={40} className="mb-4 opacity-20"/>{t('noExpenses')}</div>}
               </div>
            )}
            {activeTab === 'report' && (
               <div className="p-4 space-y-6">
                 <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
                   <p className="text-xs opacity-80 font-bold uppercase mb-1">{t('totalSpending')}</p>
                   <h2 className="text-4xl font-extrabold">${report.totalSpending.toFixed(1)}</h2>
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800 mb-3">{t('settlementPlan')}</h3>
                   <div className="space-y-3">
                     {report.tx.length === 0 ? <div className="bg-white p-6 rounded-xl text-center text-gray-400 border border-gray-100">{t('noTransfer')}</div> : report.tx.map((txItem,i) => (
                       <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2 border border-gray-100">
                         <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2 font-bold text-gray-700"><span>{txItem.from}</span><ArrowRight className="w-4 h-4 text-gray-300"/><span>{txItem.to}</span></div>
                           <span className="font-bold text-green-600 text-lg">${txItem.amount}</span>
                         </div>
                         {txItem.payId && <div className="bg-gray-50 p-2 rounded flex justify-between items-center text-xs text-gray-500 font-mono cursor-pointer hover:bg-gray-100" onClick={() => copyToClipboard(txItem.payId)}><span className="flex items-center gap-1"><CreditCard className="w-3 h-3"/> {txItem.payId}</span><button className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"><Copy className="w-3 h-3"/> {t('copy')}</button></div>}
                       </div>
                     ))}
                   </div>
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800 mb-3">{t('personalDetail')}</h3>
                   <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      {users.map(u => {
                        const s = report.stats[u] || {paid:0,share:0,net:0};
                        return (
                          <div key={u} className="p-4 border-b last:border-0 flex justify-between items-center border-gray-100">
                            <span className="font-medium text-gray-700">{u}</span>
                            <div className="text-right">
                              <div className="text-xs text-gray-400 mb-1">{t('paid')} ${s.paid.toFixed(0)} / {t('share')} ${s.share.toFixed(0)}</div>
                              <div className={`font-bold ${s.net>0.01?'text-green-600':s.net<-0.01?'text-red-500':'text-gray-300'}`}>{s.net>0?'+':''}{s.net.toFixed(1)}</div>
                            </div>
                          </div>
                        );
                      })}
                   </div>
                 </div>
               </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-2 flex justify-around items-center pb-safe z-40 transition-all">
         {currentView === 'GROUP_DETAIL' ? (
           <>
             <button onClick={()=>setActiveTab('expenses')} className={`flex flex-col items-center gap-1 w-16 ${activeTab==='expenses'?'text-blue-600':'text-gray-400'}`}><Receipt className="w-6 h-6"/><span className="text-[10px] font-bold">{t('tabExpenses')}</span></button>
             {/* FAB: Only visible in GROUP_DETAIL/EXPENSES, positioned right-bottom */}
             {activeTab === 'expenses' && (
               <button 
                 onClick={() => { setEditingExpenseId(null); setIsExpenseModalOpen(true); }} 
                 className="absolute bottom-24 right-5 bg-blue-600 text-white w-14 h-14 rounded-full shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] flex items-center justify-center active:scale-95 transition-transform hover:bg-blue-700 z-50"
               >
                 <Plus className="w-7 h-7" />
               </button>
             )}
             <button onClick={()=>setActiveTab('report')} className={`flex flex-col items-center gap-1 w-16 ${activeTab==='report'?'text-blue-600':'text-gray-400'}`}><DollarSign className="w-6 h-6"/><span className="text-[10px] font-bold">{t('tabReport')}</span></button>
           </>
         ) : (
           <>
             <button onClick={()=>setCurrentView('GROUPS')} className={`flex flex-col items-center gap-1 w-20 ${currentView==='GROUPS'?'text-blue-600':'text-gray-400'}`}><ShoppingBag className="w-6 h-6"/><span className="text-[10px] font-bold">{t('tabActivity')}</span></button>
             <button onClick={()=>setCurrentView('FRIENDS')} className={`flex flex-col items-center gap-1 w-20 ${currentView==='FRIENDS'?'text-blue-600':'text-gray-400'}`}><Users className="w-6 h-6"/><span className="text-[10px] font-bold">{t('tabMembers')}</span></button>
           </>
         )}
      </div>

      {/* Modals */}
      <ExpenseFormModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)}
        initialData={expenses.find(e => e.id === editingExpenseId)}
        users={users}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
        onAddUser={handleAddUser}
        t={t}
      />

      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform scale-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{editingGroupId ? t('editActivity') : t('createActivity')}</h2>
              <div className="mb-4">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('activityName')}</label>
                 <input className="w-full border-b-2 border-blue-100 focus:border-blue-500 outline-none text-lg py-2" value={groupTitleInput} onChange={e => setGroupTitleInput(e.target.value)} placeholder={t('exampleActivity')} autoFocus />
              </div>
              <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('activityDate')}</label>
                 <input type="date" className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-gray-100" value={groupDateInput} onChange={e => setGroupDateInput(e.target.value)} />
              </div>
              <div className="flex gap-3"><button onClick={() => setIsGroupModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl">{t('cancel')}</button><button onClick={saveGroup} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform">{t('save')}</button></div>
           </div>
        </div>
      )}

      {viewingImage && <div className="fixed inset-0 bg-black z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewingImage(null)}><img src={viewingImage} className="max-w-full max-h-full rounded shadow-2xl object-contain" /><button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/40"><X className="w-6 h-6" /></button></div>}
      
      {userAlertMsg && <ValidationAlert message={userAlertMsg} onClose={() => setUserAlertMsg(null)} t={t} />}
      {showGroupDeleteConfirm && <ConfirmDialog title={t('confirmDelete')} message={t('deleteWarning')} onConfirm={confirmGroupDelete} onCancel={() => setShowGroupDeleteConfirm(null)} t={t} />}

      <style jsx global>{`
        .pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 12px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SplitBillApp;
