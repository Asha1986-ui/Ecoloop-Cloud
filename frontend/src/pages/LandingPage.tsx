import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Coins, 
  Leaf, 
  ChevronRight, 
  CheckCircle2, 
  Droplets, 
  Waves, 
  Trees, 
  Users, 
  BarChart3, 
  Database, 
  Cpu, 
  Cloud, 
  MapPin, 
  ArrowDown, 
  Activity, 
  Globe, 
  Scale, 
  Route, 
  Lock,
  Building2
} from 'lucide-react';
import { impactService } from '../services';
import { EnvironmentalImpact } from '../types';

export const LandingPage: React.FC = () => {
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [loadingImpact, setLoadingImpact] = useState<boolean>(true);

  useEffect(() => {
    impactService
      .getGlobalImpact()
      .then((data) => {
        setImpact(data);
        setLoadingImpact(false);
      })
      .catch(() => {
        setLoadingImpact(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 font-sans">
      {/* =========================================================
          Top Navigation Bar
      ========================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  EcoLoop
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                </span>
                <span className="text-[10px] font-semibold text-cyan-800 tracking-wider block uppercase">
                  OneAquaHealth Edition
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#why-ecoloop" className="hover:text-cyan-700 transition-colors">Why EcoLoop?</a>
            <a href="#one-health" className="hover:text-cyan-700 transition-colors">One Health</a>
            <a href="#citizen-science" className="hover:text-cyan-700 transition-colors">Citizen Science</a>
            <a href="#technology" className="hover:text-cyan-700 transition-colors">Smart Tech</a>
            <a href="#impact" className="hover:text-cyan-700 transition-colors">Measurable Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
            >
              <span>Join Action</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          1. HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/60 via-slate-50 to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle Water/Ripple Decorative SVG Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <svg className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[700px]" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="600" cy="350" r="180" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
            <circle cx="600" cy="350" r="300" stroke="#0d9488" strokeWidth="1" opacity="0.3" />
            <circle cx="600" cy="350" r="440" stroke="#10b981" strokeWidth="1" strokeDasharray="6 12" opacity="0.25" />
            <circle cx="600" cy="350" r="580" stroke="#0284c7" strokeWidth="0.8" opacity="0.2" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-7">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-50/90 text-cyan-900 border border-cyan-200/90 shadow-xs text-xs sm:text-sm font-semibold backdrop-blur-sm mx-auto">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-600"></span>
            </span>
            <span>🌊 One Health • Healthy Waters • Healthy Ecosystems • Healthy Communities</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Protect Our Waters. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Reward Every Action.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            EcoLoop turns everyday plastic waste into measurable environmental impact — empowering citizens to keep urban communities and freshwater ecosystems cleaner and healthier.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 transition-all hover:-translate-y-0.5"
            >
              <span>Start Recycling</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>Explore EcoLoop</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm">
              <div className="p-3 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Focus Vector</div>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                  <Waves className="w-4 h-4 text-cyan-600" /> Urban Catchments
                </div>
              </div>
              <div className="p-3 text-center border-l border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Methodology</div>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-teal-600" /> Citizen Science
                </div>
              </div>
              <div className="p-3 text-center border-l border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Paradigm</div>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                  <Database className="w-4 h-4 text-emerald-600" /> Traceable Audits
                </div>
              </div>
              <div className="p-3 text-center border-l border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outcome</div>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Cleaner Waters
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. WHY ECOLOOP? SECTION (From Plastic Waste to Healthier Waters)
      ========================================================= */}
      <section id="why-ecoloop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200">
            <Droplets className="w-3.5 h-3.5 text-teal-600" />
            The Urban Freshwater Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Plastic Waste to Healthier Waters
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2">
            Plastic waste generated in urban communities can enter drains, lakes, rivers, and other freshwater environments. EcoLoop encourages citizens to collect recyclable plastic, request responsible pickup, and participate in a technology-enabled recycling ecosystem — converting these citizen actions into measurable environmental data and impact indicators.
          </p>
        </div>

        {/* Visual Sequential Flow */}
        <div className="relative mt-12">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-emerald-200 via-cyan-200 to-teal-300 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
            {[
              {
                step: '01',
                title: 'Citizen Action',
                desc: 'Household separation and doorstep pickup booking via mobile/web.',
                icon: Users,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
              },
              {
                step: '02',
                title: 'Plastic Collected',
                desc: 'PET polymers segregated at origin before entering municipal drainage runoff.',
                icon: Recycle,
                color: 'text-teal-700 bg-teal-50 border-teal-200'
              },
              {
                step: '03',
                title: 'Verified Pickup',
                desc: 'Authorized field agents audit bottle counts and verified weights at doorstep.',
                icon: Truck,
                color: 'text-cyan-700 bg-cyan-50 border-cyan-200'
              },
              {
                step: '04',
                title: 'Environmental Data',
                desc: 'Real-time telemetry captures volume, ward location, and collection cadence.',
                icon: Database,
                color: 'text-blue-700 bg-blue-50 border-blue-200'
              },
              {
                step: '05',
                title: 'Reduced Leakage',
                desc: 'Direct interception stops macro-plastics and microplastic degradation in waterways.',
                icon: ShieldCheck,
                color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
              },
              {
                step: '06',
                title: 'Healthier Ecosystems',
                desc: 'Clean urban canals, resilient riverbanks, and safeguarded freshwater life.',
                icon: Waves,
                color: 'text-teal-700 bg-teal-50 border-teal-200'
              }
            ].map((node, idx) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.step}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-400 group-hover:text-cyan-600 transition-colors">
                        STEP {node.step}
                      </span>
                      {idx < 5 && (
                        <span className="lg:hidden text-slate-400">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${node.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{node.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          3. ONE HEALTH CONNECTION SECTION
      ========================================================= */}
      <section id="one-health" className="py-20 bg-gradient-to-b from-white via-cyan-50/30 to-white px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider border border-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Integrated Sustainability
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One Action. Three Dimensions of Health.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              The One Health approach acknowledges that human wellbeing, ecological vitality, and freshwater balance are inextricably linked. EcoLoop connects all three dimensions through a single daily citizen habit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Healthy Waters */}
            <div className="bg-white rounded-3xl p-8 border border-cyan-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center border border-cyan-200">
                  <Waves className="w-7 h-7 text-cyan-600" />
                </div>
                <div className="inline-block px-3 py-1 bg-cyan-50 text-cyan-800 rounded-full text-xs font-bold">
                  Dimension 01
                </div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  🌊 Healthy Waters
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Reducing plastic waste that can reach urban freshwater environments.
                </p>
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <span>Intercepts non-biodegradable polymers before urban storm drains carry them to lakes and river basins.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <span>Prevents microplastic fragmentation that harms freshwater benthic organisms and fish habitats.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Healthy Ecosystems */}
            <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Trees className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
                  Dimension 02
                </div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  🌱 Healthy Ecosystems
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Supporting cleaner surroundings and more sustainable resource recovery.
                </p>
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Diverts solid plastic into authorized circular value chains, eliminating illegal open dumping and incineration.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Lowers greenhouse emissions by offsetting petroleum extraction required for virgin plastics.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Healthy Communities */}
            <div className="bg-white rounded-3xl p-8 border border-teal-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-200">
                  <Users className="w-7 h-7 text-teal-600" />
                </div>
                <div className="inline-block px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold">
                  Dimension 03
                </div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  👥 Healthy Communities
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Engaging citizens in environmental action and rewarding sustainable participation.
                </p>
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Encourages doorstep civic engagement, providing households with direct visibility into their environmental footprint.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Empowers informal collectors with verified digital routes, fair incentives, and formal municipal inclusion.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. CITIZEN SCIENCE / ENVIRONMENTAL DATA SECTION
      ========================================================= */}
      <section id="citizen-science" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider border border-blue-200">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            Citizen-Generated Environmental Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Every Pickup Creates Data. <br className="hidden sm:inline" />
            Every Data Point Creates Insight.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            EcoLoop operates as a grassroots environmental sensor: transforming routine recycling actions into structured, geospatial data that empowers communities, researchers, and municipal leaders to target plastic leakage hot-spots.
          </p>
        </div>

        {/* Data Points Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { label: 'Bottle Quantity', desc: 'Item-level count logged per household stop.', icon: Droplets, val: 'Batch Audits' },
            { label: 'Plastic Weight', desc: 'Verified kilogram weight captured by field scale.', icon: Scale, val: 'Kilograms' },
            { label: 'Pickup Location & City', desc: 'Geocoded street and ward-level location tracking.', icon: MapPin, val: 'Geotagged' },
            { label: 'Collection Frequency', desc: 'Temporal recycling intervals across urban wards.', icon: Activity, val: 'Time Series' },
            { label: 'Recycling Activity', desc: 'Citizen lifecycle from request to physical handover.', icon: Recycle, val: 'Status Flow' },
            { label: 'Citizen Participation', desc: 'Density of participating households per community.', icon: Users, val: 'Civic Reach' },
            { label: 'Environmental Impact', desc: 'Algorithmic conversion into CO₂ and energy metrics.', icon: Trees, val: 'Calculated' },
            { label: 'Community Trends', desc: 'Aggregated analytics revealing regional waste patterns.', icon: Globe, val: 'Ward Level' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {item.val}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1 leading-normal">{item.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Architecture Diagram */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="px-3 py-1 bg-white/10 text-cyan-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Data Pipeline Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">From Household Handover to Urban Decision Support</h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              EcoLoop bridges grassroots citizen participation and municipal governance by structuring doorstep collection into verifiable environmental datasets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-1">STAGE 1</span>
                <h4 className="font-bold text-base text-white">Citizen-Generated Data</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Image uploads, estimated bottle counts, and pickup coordinates logged by residents.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-cyan-200">
                Source: Doorstep App
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-300 block mb-1">STAGE 2</span>
                <h4 className="font-bold text-base text-white">EcoLoop Platform</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Secure ingestion, route heuristics, physical collector audit, and EcoCredits dispatch.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-teal-200">
                Engine: Spring Boot Core
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 block mb-1">STAGE 3</span>
                <h4 className="font-bold text-base text-white">Environmental Insights</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Plastic interception rates, calculated carbon avoidance, and ward-level diversion metrics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200">
                Analytics: Impact Engine
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 block mb-1">STAGE 4</span>
                <h4 className="font-bold text-base text-white">Decision Support</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Actionable reports for municipal agencies to target high-leakage catchment zones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-200">
                Outcome: Policy Insights
              </div>
            </div>
          </div>

          {/* Clarification Box */}
          <div className="mt-8 p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              <strong>Note for Evaluators:</strong> EcoLoop is positioned as an upstream plastic pollution prevention and recycling data platform. It complements, rather than performs, in-situ scientific biochemical water-quality probe monitoring.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. SMART TECHNOLOGY SECTION
      ========================================================= */}
      <section id="technology" className="py-20 bg-slate-100/70 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              End-to-End Technology Stack
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Technology for a Cleaner Future
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Engineered with modern cloud architecture to deliver dependable logistics, AI-assisted verification, and auditable environmental data accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tech 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-cyan-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 border border-cyan-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">🤖 AI Bottle Estimation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estimate bottle quantities and plastic weight from uploaded citizen photos, streamlining pickup preparation and reducing manual guesswork.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-cyan-700">
                Computer Vision Integration
              </div>
            </div>

            {/* Tech 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">📍 Smart Collection Routing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Support efficient pickup planning by sequencing daily stops based on geographic density and scheduled time slots, saving fuel and time.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                Route Heuristics Engine
              </div>
            </div>

            {/* Tech 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-teal-300">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">📊 Impact Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Translate raw recycling activity into understandable impact metrics: CO₂ abatement, energy saved, and macro-plastics diverted from waterways.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-teal-700">
                Environmental Conversion Formulas
              </div>
            </div>

            {/* Tech 4 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-amber-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">🎁 EcoCredits</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reward verified citizen participation with 5 EcoCredits per bottle, redeemable for government-partner vouchers, transit passes, and utilities.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700">
                Automated Ledger & Vouchers
              </div>
            </div>

            {/* Tech 5 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">☁️ Cloud Platform</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enable scalable access and centralized environmental data storage, containerized with Docker and ready for Azure cloud deployment.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
                Spring Boot 3 + MySQL + Vite SPA
              </div>
            </div>

            {/* Tech 6 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">🔐 Secure Role-Based Platform</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict Spring Security JWT access controls distinguishing Citizen booking, Collector field auditing, and Admin governance workflows.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-indigo-700">
                Stateless Token Authorization
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. REAL IMPACT SECTION (Measure the Impact of Every Bottle)
      ========================================================= */}
      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider border border-cyan-200">
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            Live Platform Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Measure the Impact of Every Bottle
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Real data from authenticated household collections. Every bottle intercepted is one less contaminant reaching vulnerable urban freshwater catchments.
          </p>
        </div>

        {/* Dynamic Metric Cards from Application Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bottles Recycled */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bottles Recycled</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                {loadingImpact ? '...' : (impact?.bottlesRecycled ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Interception of recyclable PET plastics.</p>
            </div>
          </div>

          {/* Plastic Diverted */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Plastic Diverted</span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-teal-600 tracking-tight">
                {loadingImpact ? '...' : `${(impact?.plasticWeightKg ?? 0).toFixed(1)} kg`}
              </div>
              <p className="text-xs text-slate-500 mt-1">Weight prevented from entering urban drains.</p>
            </div>
          </div>

          {/* EcoCredits Earned */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">EcoCredits Earned</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">
                {loadingImpact ? '...' : ((impact?.bottlesRecycled ?? 0) * 5).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Credited directly to citizen wallets.</p>
            </div>
          </div>

          {/* CO2 Reduction */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated CO₂ Saved</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-600 tracking-tight">
                {loadingImpact ? '...' : `${(impact?.estimatedCO2ReductionKg ?? 0).toFixed(1)} kg`}
              </div>
              <p className="text-xs text-slate-500 mt-1">Greenhouse footprint avoidance.</p>
            </div>
          </div>
        </div>

        {/* Database Integrity Guarantee */}
        <div className="mt-8 text-center text-xs text-slate-400">
          💡 Metric values are retrieved dynamically from the active EcoLoop backend database. No synthetic or inflated numbers.
        </div>
      </section>

      {/* =========================================================
          7. HACKATHON POSITIONING SECTION
      ========================================================= */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-white/10">
            <Building2 className="w-4 h-4 text-cyan-300" />
            IEEE OneAquaHealth Global Hackathon 2026
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for the One Health Future
          </h2>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            EcoLoop connects citizen participation, responsible plastic recovery, environmental data, and community incentives into one digital platform — creating a pathway from individual action to healthier urban ecosystems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-cyan-300 font-bold text-xs sm:text-sm border border-cyan-400/30">
              Citizen Science
            </span>
            <span className="text-slate-400">•</span>
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-teal-300 font-bold text-xs sm:text-sm border border-teal-400/30">
              Environmental Intelligence
            </span>
            <span className="text-slate-400">•</span>
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-400/30">
              One Health
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. FINAL CALL TO ACTION (Start Making an Impact)
      ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="bg-gradient-to-b from-cyan-50/50 via-teal-50/30 to-white rounded-3xl border-2 border-cyan-200/70 p-8 sm:p-14 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">
            <Droplets className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Start Making an Impact
          </h2>

          <p className="text-lg sm:text-xl font-medium text-slate-700 max-w-xl mx-auto">
            Collect. Recycle. Contribute. Protect our waters.
          </p>

          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Join thousands of citizens taking direct responsibility for urban freshwater sustainability. Request a pickup from your doorstep today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>Start Recycling</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>Explore EcoLoop</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          Footer
      ========================================================= */}
      <footer className="bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">EcoLoop Platform</span>
              <span className="block text-[11px] text-slate-400">
                IEEE OneAquaHealth Global Hackathon 2026 Submission
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
            <a href="#why-ecoloop" className="hover:text-cyan-700">Problem Framing</a>
            <a href="#one-health" className="hover:text-cyan-700">One Health Model</a>
            <a href="#citizen-science" className="hover:text-cyan-700">Citizen Science</a>
            <a href="#technology" className="hover:text-cyan-700">Technology Architecture</a>
            <Link to="/login" className="hover:text-cyan-700">Portal Login</Link>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            &copy; 2026 EcoLoop. Healthy Waters • Healthy Ecosystems • Healthy Communities.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
