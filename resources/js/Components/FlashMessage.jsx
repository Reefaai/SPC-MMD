import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [flash.success, flash.error]);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setVisible(false), 3500);
        return () => clearTimeout(timer);
    }, [visible]);

    if (!visible) return null;

    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };

    const icons = {
        success: '✓',
        error: '✕',
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ${styles[type]}`}>
            <span className="text-lg font-bold">{icons[type]}</span>
            <span className="text-sm font-medium">{message}</span>
            <button onClick={() => setVisible(false)} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
    );
}
