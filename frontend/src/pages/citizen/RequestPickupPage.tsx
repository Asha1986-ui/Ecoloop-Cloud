import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { aiService, pickupService } from '../../services';
import { BottleEstimate } from '../../types';
import { 
  Recycle, Sparkles, Upload, Calendar, Clock, MapPin, 
  CheckCircle, ArrowRight, AlertCircle, Image as ImageIcon 
} from 'lucide-react';

export const RequestPickupPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Bangalore');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:00 - 11:00 AM');
  const [notes, setNotes] = useState('');

  // AI Bottle Estimation State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<BottleEstimate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPickup, setSubmittedPickup] = useState<any | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      setIsAnalyzing(true);
      try {
        const estimate = await aiService.estimateBottles(file);
        setAiEstimate(estimate);
        showToast('AI Bottle Estimation completed! 🤖', 'success');
      } catch (err) {
        showToast('AI estimation error. Standard calculation will be used.', 'error');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        address,
        city,
        pickupDate,
        timeSlot,
        notes,
        estimatedBottleCount: aiEstimate?.estimatedBottleCount || 25,
        estimatedWeight: aiEstimate?.estimatedPlasticWeightKg || 0.6,
        aiConfidence: aiEstimate?.confidencePercentage || 92.0,
      };

      const result = await pickupService.createPickup(payload);
      setSubmittedPickup(result);
      showToast('Pickup request created successfully 🎉', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit pickup request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedPickup) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Pickup Request Created Successfully 🎉</h2>
        <p className="text-sm text-slate-500 mt-2">
          An authorized collection team has been notified. You can track your pickup status anytime.
        </p>

        <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Pickup ID:</span>
            <span className="font-bold text-slate-800">#{submittedPickup.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled Date:</span>
            <span className="font-semibold text-slate-800">{submittedPickup.pickupDate} ({submittedPickup.timeSlot})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Doorstep Address:</span>
            <span className="font-semibold text-slate-800">{submittedPickup.address}, {submittedPickup.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Bottles:</span>
            <span className="font-semibold text-emerald-700">{submittedPickup.estimatedBottleCount} bottles (~{submittedPickup.estimatedWeight} kg)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Initial Status:</span>
            <span className="font-bold text-amber-600">REQUESTED</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/citizen/my-pickups')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-md shadow-emerald-600/20"
          >
            Go to My Pickups
          </button>
          <button
            onClick={() => {
              setSubmittedPickup(null);
              setAiEstimate(null);
              setImagePreview(null);
            }}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
          >
            Schedule Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Request Doorstep Pickup</h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide your address, snap a photo of your plastic bottles for AI estimation, and schedule a pickup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Address & Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> Doorstep Location & Time
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Apartment, Street name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Preferred Time Window
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="08:00 - 10:00 AM">08:00 - 10:00 AM (Early Morning)</option>
              <option value="10:00 - 12:00 PM">10:00 - 12:00 PM (Morning)</option>
              <option value="02:00 - 04:00 PM">02:00 - 04:00 PM (Afternoon)</option>
              <option value="04:00 - 06:00 PM">04:00 - 06:00 PM (Evening)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Instructions for Worker (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bag is placed near the security guard desk"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Right Column: AI Bottle Estimation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <h2 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI-Assisted Bottle Estimation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload a photo of your plastic bottles. Our computer-vision service will detect recyclable items and estimate volume.
            </p>

            <div className="mt-4 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center transition-colors relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Uploaded Recyclables"
                    className="max-h-40 mx-auto rounded-xl object-cover shadow-sm"
                  />
                  <p className="text-xs text-emerald-600 font-semibold">Click or drop to replace photo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Click to upload bottle photo</p>
                  <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            {isAnalyzing && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">Analyzing your recyclable plastic...</p>
              </div>
            )}

            {aiEstimate && !isAnalyzing && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Detection Results
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900">
                    {aiEstimate.confidencePercentage}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-white rounded-xl shadow-xs">
                    <div className="text-xl font-black text-emerald-700">{aiEstimate.estimatedBottleCount}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Estimated Bottles</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl shadow-xs">
                    <div className="text-xl font-black text-teal-700">{aiEstimate.estimatedPlasticWeightKg} kg</div>
                    <div className="text-[11px] text-slate-400 font-medium">Est. Plastic Weight</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  {aiEstimate.detectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 leading-snug">
                  <strong>AI Estimate:</strong> {aiEstimate.disclaimer}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirm & Request Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};