import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Sparkles } from 'lucide-react';
import {
  getModuleBySlug,
  getNextUnfinishedModule,
  getPathBySlug,
  getPathProgress,
  getPathCompletedCount,
  loadLearningProgress,
  saveLearningProgress,
  type LearningProgress,
} from '../data/learningPaths';

export function LearningModulePage() {
  const { pathSlug, moduleSlug } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<LearningProgress>({});

  useEffect(() => {
    setProgress(loadLearningProgress());
  }, [pathSlug, moduleSlug]);

  const path = useMemo(() => (pathSlug ? getPathBySlug(pathSlug) : null), [pathSlug]);
  const module = useMemo(() => (pathSlug && moduleSlug ? getModuleBySlug(pathSlug, moduleSlug) : null), [pathSlug, moduleSlug]);

  const nextModule = useMemo(() => {
    if (!path) return null;
    const next = getNextUnfinishedModule(path, progress);
    if (!next || next.slug === module?.slug) {
      const currentIndex = path.modules.findIndex((item) => item.slug === moduleSlug);
      return currentIndex >= 0 && currentIndex < path.modules.length - 1 ? path.modules[currentIndex + 1] : null;
    }
    return next;
  }, [path, progress, module, moduleSlug]);

  const pathProgress = path ? getPathProgress(path, progress) : 0;
  const completedCount = path ? getPathCompletedCount(path, progress) : 0;

  if (!path || !module) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }} className="flex items-center justify-center p-12">
        <div className="max-w-2xl text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>Learning module not found</h2>
          <p style={{ color: '#64748B' }} className="mt-4">The requested learning module could not be loaded. Please return to the hub and choose a path.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/learn" className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}>
              Back to Learning Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = progress[path.slug]?.includes(module.slug);

  function handleMarkComplete() {
    const current = progress[path.slug] ?? [];
    if (current.includes(module.slug)) {
      return;
    }

    const nextProgress = {
      ...progress,
      [path.slug]: [...current, module.slug],
    };

    saveLearningProgress(nextProgress);
    setProgress(nextProgress);
  }

  function handleNext() {
    if (nextModule) {
      navigate(`/learn/${path.slug}/${nextModule.slug}`);
    } else {
      navigate('/learn');
    }
  }

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#94A3B8' }}>{path.title}</p>
              <h1 className="mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
                {module.title}
              </h1>
            </div>
            <Link to="/learn" className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: 'var(--abyss-ink)', color: 'var(--meridian-gold)' }}>
              Back to Learning Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-8">
        <main className="space-y-8">
          <div className="rounded-3xl border bg-white p-8" style={{ borderColor: 'var(--stone-ridge)' }}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Clock className="w-4 h-4" /> {module.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <Sparkles className="w-4 h-4" /> {module.stage}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{module.description}</p>
              <div className="rounded-2xl bg-slate-50 p-6">
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--abyss-ink)' }}>Lesson content</p>
                <div className="space-y-6 text-sm" style={{ color: '#334155' }}>
                  <div>
                    <h2 className="font-semibold mb-2">What you will learn</h2>
                    <ul className="list-disc list-inside space-y-2">
                      <li>How this module fits into the {path.title} path.</li>
                      <li>Core technical concepts for {module.stage}.</li>
                      <li>Practical steps to apply this lesson in a real design flow.</li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="font-semibold mb-2">Practical exercise</h2>
                    <p>Review the current stage, identify the next checklist item, and compare design constraints against expected flow requirements.</p>
                  </div>
                  <div>
                    <h2 className="font-semibold mb-2">Resources</h2>
                    <p className="text-sm text-slate-600">Review the related docs in the TapeItOut Docs Hub or the OpenROAD Cookbook for stage-specific commands and examples.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border bg-white p-8" style={{ borderColor: 'var(--stone-ridge)' }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>Path Progress</p>
                <p className="text-xs text-slate-500">{completedCount} of {path.modules.length} completed</p>
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--meridian-gold)' }}>{pathProgress}%</div>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${pathProgress}%` }} />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>Next Steps</p>
              <div className="text-sm text-slate-600">
                {nextModule ? (
                  <>
                    Continue to <strong>{nextModule.title}</strong> in the path.
                  </>
                ) : (
                  <>This path is complete. Return to the hub to start another learning journey.</>
                )}
              </div>
            </div>
          </div>
        </main>

        <aside className="space-y-6">
          <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--stone-ridge)' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Mark progress</p>
            <button
              type="button"
              onClick={handleMarkComplete}
              className="w-full rounded-full px-4 py-3 text-sm font-semibold transition hover:shadow-sm"
              style={{ background: isCompleted ? 'var(--stone-ridge)' : 'var(--meridian-gold)', color: 'var(--abyss-ink)' }}
            >
              {isCompleted ? 'Completed' : 'Mark as complete'}
            </button>
            <p className="mt-3 text-xs text-slate-500">Progress is saved locally and will persist on refresh.</p>
          </div>

          <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--stone-ridge)' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Module queue</p>
            <div className="space-y-3">
              {path.modules.map((item) => (
                <div key={item.slug} className="flex items-center justify-between gap-3 rounded-2xl p-3" style={{ background: item.slug === module.slug ? '#F8FAFC' : '#FFFFFF' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>{item.title}</p>
                    <p className="text-xs text-slate-500">{item.duration}</p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: item.slug === module.slug ? 'var(--abyss-ink)' : '#94A3B8' }}>
                    {progress[path.slug]?.includes(item.slug) ? '✓ Done' : item.slug === module.slug ? 'Current' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {nextModule && (
            <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--stone-ridge)' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: 'var(--abyss-ink)' }}>Up next</p>
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--abyss-ink)' }}>{nextModule.title}</p>
                  <p className="text-xs text-slate-500">{nextModule.duration}</p>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
                  style={{ background: 'var(--abyss-ink)', color: 'var(--meridian-gold)' }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
