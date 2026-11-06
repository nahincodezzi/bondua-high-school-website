import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Module Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-200 text-center max-w-md mx-auto my-8 space-y-4 font-bangla shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">এই মডিউলটি লোড করতে সমস্যা হয়েছে</h3>
          <p className="text-xs text-slate-600">
            সাময়িক ত্রুটির কারণে মডিউলটি প্রদর্শিত হচ্ছে না। পৃষ্ঠাটি রিফ্রেশ করুন অথবা পুনরায় চেষ্টা করুন।
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="inline-flex items-center gap-1.5 bg-[#14532D] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>পুনরায় চেষ্টা করুন</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
