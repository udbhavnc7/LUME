import { ArrowUpRight, ChevronRight, CircleDot, Clock3, Landmark, MapPinned, ShieldCheck, Sparkles, Target, TrendingUp, Upload, Zap } from 'lucide-react';
import { DataMode, LandAcquisitionProject } from '../types';
import { ThreeSignalField } from './ThreeSignalField';

interface CommandCenterHeroProps {
  projects: LandAcquisitionProject[];
  criticalAlertsCount: number;
  language: 'EN' | 'HI';
  dataMode: DataMode;
  onOpenGIS: () => void;
  onOpenIPIModal?: () => void;
  onOpenImport?: () => void;
}

export function CommandCenterHero({
  projects,
  criticalAlertsCount,
  language,
  dataMode,
  onOpenGIS,
  onOpenIPIModal,
  onOpenImport,
}: CommandCenterHeroProps) {
  const totalBudgetCr = projects.reduce((sum, project) => sum + project.estimatedBudgetCr, 0);
  const totalFamilies = projects.reduce((sum, project) => sum + project.affectedLandownersCount, 0);
  const highRiskCount = projects.filter((project) => project.modelOutput.delayProbability >= 0.7).length;
  const averageRisk = projects.length
    ? Math.round(projects.reduce((sum, project) => sum + project.modelOutput.delayProbability, 0) / projects.length * 100)
    : 0;
  const budgetLabel = totalBudgetCr >= 1000 ? `${(totalBudgetCr / 1000).toFixed(1)}k` : totalBudgetCr.toFixed(0);

  return (
    <section className="command-hero" aria-labelledby="command-hero-title">
      <div className="command-hero__copy">
        <div className="command-hero__eyebrow">
          <span className="live-dot" />
          <span>{language === 'HI' ? 'राष्ट्रीय अधिग्रहण इंटेलिजेंस' : 'National acquisition intelligence'}</span>
          <span className="command-hero__eyebrow-divider" />
          <span>{language === 'HI' ? 'अंतिम सिंक 08:42 IST' : 'Last sync 08:42 IST'}</span>
        </div>
        <h1 id="command-hero-title" className="command-hero__title">
          {language === 'HI' ? 'अगला बाधा पहले दिखाइए।' : 'See the next bottleneck before it arrives.'}
        </h1>
        <p className="command-hero__description">
          {language === 'HI'
            ? 'विभिन्न रजिस्ट्री, अदालती और उपग्रह संकेतों को एक स्पष्ट कार्य-क्रम में बदलें — जहां ध्यान देना है, वहां तुरंत।'
            : 'LUME turns fragmented statutory records into a calm, evidence-weighted action queue for the people who can unblock a corridor.'}
        </p>
        <div className="command-hero__actions">
          <button className="lume-button lume-button--primary" onClick={onOpenGIS}>
            <MapPinned size={16} strokeWidth={2.2} />
            <span>{language === 'HI' ? 'क्षेत्र देखें' : 'Explore live map'}</span>
            <ArrowUpRight size={15} />
          </button>
          {onOpenIPIModal && (
            <button className="lume-button lume-button--quiet" onClick={onOpenIPIModal}>
              <Target size={16} />
              <span>{language === 'HI' ? 'IPI स्कोर देखें' : 'Tune IPI model'}</span>
            </button>
          )}
          {dataMode === 'REAL_DATA' && onOpenImport && (
            <button className="lume-button lume-button--quiet" onClick={onOpenImport}>
              <Upload size={16} />
              <span>{language === 'HI' ? 'डेटा आयात' : 'Import data'}</span>
            </button>
          )}
        </div>
        <div className="command-hero__trust-line">
          <span><ShieldCheck size={14} /> {language === 'HI' ? 'मानव-निरीक्षण निर्णय' : 'Human-in-the-loop decisions'}</span>
          <span><CircleDot size={14} /> {language === 'HI' ? 'स्पष्ट स्रोत' : 'Explainable by design'}</span>
          <span><Zap size={14} /> {language === 'HI' ? 'ऑफलाइन तैयार' : 'Offline ready'}</span>
        </div>
      </div>

      <div className="command-hero__visual" aria-label="Live portfolio signal field">
        <div className="signal-field__grid" />
        <div className="signal-field__halo signal-field__halo--one" />
        <div className="signal-field__halo signal-field__halo--two" />
        <ThreeSignalField />
        <div className="signal-field__label signal-field__label--top">
          <span className="signal-field__label-line" />
          <span>PORTFOLIO SIGNAL FIELD</span>
        </div>
        <div className="signal-field__label signal-field__label--bottom">
          <span className="signal-field__label-line" />
          <span>52 NODES / 1,467 PRECEDENTS</span>
        </div>
        <div className="signal-field__status">
          <span className="signal-field__status-icon"><TrendingUp size={14} /></span>
          <span><strong>+18.4%</strong> foresight coverage</span>
        </div>
      </div>

      <div className="command-hero__metrics">
        <div className="hero-metric">
          <div className="hero-metric__icon hero-metric__icon--mint"><Landmark size={16} /></div>
          <div><span>{language === 'HI' ? 'निगरानी में मूल्य' : 'Value monitored'}</span><strong>₹{budgetLabel} Cr</strong></div>
          <small>+12.8%</small>
        </div>
        <div className="hero-metric">
          <div className="hero-metric__icon hero-metric__icon--gold"><Clock3 size={16} /></div>
          <div><span>{language === 'HI' ? 'घड़ी-जोखिम' : 'Clock risk'}</span><strong>{criticalAlertsCount} <em>alerts</em></strong></div>
          <small className="is-gold">needs action</small>
        </div>
        <div className="hero-metric">
          <div className="hero-metric__icon hero-metric__icon--coral"><ShieldCheck size={16} /></div>
          <div><span>{language === 'HI' ? 'उच्च जोखिम' : 'High-risk corridors'}</span><strong>{highRiskCount} <em>of {projects.length}</em></strong></div>
          <small className="is-coral">{averageRisk}% avg risk</small>
        </div>
        <div className="hero-metric">
          <div className="hero-metric__icon hero-metric__icon--blue"><Sparkles size={16} /></div>
          <div><span>{language === 'HI' ? 'प्रभावित परिवार' : 'Families in scope'}</span><strong>{totalFamilies.toLocaleString()}</strong></div>
          <small>across {projects.length} projects</small>
        </div>
      </div>
    </section>
  );
}
