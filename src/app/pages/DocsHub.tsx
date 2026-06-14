import { useState } from 'react';
import { Link } from 'react-router';
import { Search, ChevronRight, ExternalLink } from 'lucide-react';
import docs from './docs/content';

const sections: Record<string, string[]> = {
  'Getting Started': ['introduction-to-tapeitout', 'setting-up-openroad', 'openroad-cookbook', 'your-first-design-flow', 'atlas-quickstart'],
  'OpenROAD Flow': ['rtl-synthesis-with-yosys', 'floorplanning', 'placement-with-replace', 'cts-with-tritoncts', 'routing-with-fastroute', 'signoff-with-opensta'],
  'Sky130 PDK': ['sky130-overview', 'sky130-standard-cells', 'sky130-io-pads', 'sky130-sram-macros', 'sky130-design-rules'],
  'GF180MCU PDK': ['gf180-overview', 'gf180-process-layers', 'gf180-device-types', 'gf180-design-rules'],
  'Timing Analysis': ['understanding-sdc', 'setup-timing', 'hold-timing', 'clock-domain-crossing', 'multi-corner-analysis'],
  'Atlas API': ['atlas-api-reference', 'atlas-api-authentication', 'atlas-api-endpoints', 'atlas-api-webhooks', 'atlas-api-rate-limits'],
  'Error Reference': ['error-code-index', 'cts-errors', 'timing-errors', 'routing-errors', 'drc-lvs-errors'],
};

const currentDoc = {
  title: 'Clock Tree Synthesis with TritonCTS',
  breadcrumb: ['OpenROAD Flow', 'CTS with TritonCTS'],
  lastUpdated: 'Dec 12, 2024',
  readTime: '12 min read',
  toc: [
    'Overview',
    'Prerequisites',
    'Clock Definition (SDC)',
    'Running CTS',
    'Verifying the Clock Tree',
    'Common Issues',
    'Advanced Configuration',
  ],
  content: [
    {
      heading: 'Overview',
      body: 'Clock Tree Synthesis (CTS) is the process of inserting buffers and inverters to distribute the clock signal across the entire design with minimal skew. TritonCTS is the CTS engine integrated into OpenROAD.',
    },
    {
      heading: 'Prerequisites',
      body: 'Before running CTS, ensure you have:\n• Completed global placement\n• Defined all clock sources in your SDC file using create_clock\n• Verified placement DRC passes with no critical violations',
    },
    {
      heading: 'Clock Definition (SDC)',
      body: 'The most common cause of CTS failure (CTS-0008) is a missing clock definition. Every clock in your design must be explicitly defined in the SDC file before CTS runs.',
      code: '# Required: define your clock\ncreate_clock -name clk -period 10.0 [get_ports clk]\nset_clock_uncertainty 0.1 [get_clocks clk]\nset_clock_transition 0.15 [get_clocks clk]',
      codeLanguage: 'sdc',
    },
    {
      heading: 'Running CTS',
      body: 'In OpenROAD, CTS is invoked via the clock_tree_synthesis command. The key parameters control buffer selection and target skew.',
      code: 'clock_tree_synthesis \\\n  -root_buf sky130_fd_sc_hd__clkbuf_16 \\\n  -buf_list {sky130_fd_sc_hd__clkbuf_4 sky130_fd_sc_hd__clkbuf_8} \\\n  -wire_unit 20 \\\n  -clk_nets clk',
      codeLanguage: 'tcl',
    },
  ],
};

export function DocsHub() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('OpenROAD Flow');
  const [activeToc, setActiveToc] = useState('Overview');

  const isSearching = search.trim() !== '';
  const query = search.toLowerCase().trim();

  // Filter sections and pages based on search query
  const filteredSections = Object.entries(sections).reduce((acc, [section, pages]) => {
    const matchingPages = pages.filter(slug => {
      if (!isSearching) return true;
      const doc = docs[slug];
      if (!doc) return false;
      const matchTitle = doc.title.toLowerCase().includes(query);
      const matchContent = doc.content.some(sec => 
        sec.heading.toLowerCase().includes(query) || 
        sec.body.toLowerCase().includes(query)
      );
      return matchTitle || matchContent;
    });
    if (matchingPages.length > 0) {
      acc[section] = matchingPages;
    }
    return acc;
  }, {} as Record<string, string[]>);

  // Compute search results list for the center pane
  const searchResults = isSearching
    ? Object.entries(docs).map(([slug, doc]) => {
        const matchTitle = doc.title.toLowerCase().includes(query);
        let matchSnippet = '';
        let matchSection = '';

        for (const section of doc.content) {
          if (section.heading.toLowerCase().includes(query)) {
            matchSection = section.heading;
            matchSnippet = section.body.substring(0, 140) + '...';
            break;
          }
          const idx = section.body.toLowerCase().indexOf(query);
          if (idx !== -1) {
            matchSection = section.heading;
            const start = Math.max(0, idx - 40);
            const end = Math.min(section.body.length, idx + query.length + 80);
            matchSnippet = (start > 0 ? '...' : '') + section.body.substring(start, end) + (end < section.body.length ? '...' : '');
            break;
          }
        }

        if (matchTitle || matchSnippet) {
          return {
            slug,
            title: doc.title,
            breadcrumb: doc.breadcrumb,
            readTime: doc.readTime,
            matchSection,
            matchSnippet,
          };
        }
        return null;
      }).filter(Boolean) as Array<{
        slug: string;
        title: string;
        breadcrumb: string[];
        readTime: string;
        matchSection: string;
        matchSnippet: string;
      }>
    : [];

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      {/* Doc Header */}
      <div className="border-b" style={{ background: '#FFFFFF', borderColor: 'var(--stone-ridge)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--abyss-ink)' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--meridian-gold)', fontFamily: 'var(--font-mono)' }}>T</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--abyss-ink)' }}>TapeItOut Docs</span>
              </div>
              <div className="w-px h-4" style={{ background: 'var(--stone-ridge)' }} />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94A3B8' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
                  style={{ background: 'var(--canvas-bone)', border: '1px solid var(--stone-ridge)', fontFamily: 'var(--font-ui)', color: 'var(--abyss-ink)', width: '240px' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/docs/openroad-cookbook" className="text-sm" style={{ color: '#64748B' }}>OpenROAD Cookbook</Link>
              <a href="#" className="flex items-center gap-1 text-sm" style={{ color: '#64748B' }}>
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 flex" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Left Sidebar */}
        <aside className="w-60 shrink-0 border-r overflow-y-auto sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', background: '#FAFAF7', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          {Object.entries(filteredSections).map(([section, pages]) => {
            const isSectionOpen = !isSearching ? activeSection === section : true;
            return (
              <div key={section} className="mb-1 px-4">
                <button
                  className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-left"
                  style={{ color: isSectionOpen ? 'var(--abyss-ink)' : '#94A3B8', letterSpacing: '0.06em' }}
                  onClick={() => !isSearching && setActiveSection(activeSection === section ? '' : section)}
                  disabled={isSearching}
                >
                  <span>{section.toUpperCase()}</span>
                  {!isSearching && (
                    <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === section ? 'rotate-90' : ''}`} />
                  )}
                </button>
                {isSectionOpen && (
                  <div className="ml-2 mt-1 mb-2 space-y-0.5">
                    {pages.map(slug => (
                      <Link
                        key={slug}
                        to={`/docs/${slug}`}
                        className="w-full text-left text-xs px-3 py-1.5 rounded transition-colors block"
                        style={{
                          color: slug === 'cts-with-tritoncts' ? 'var(--abyss-ink)' : '#64748B',
                          background: slug === 'cts-with-tritoncts' ? '#FFFFFF' : 'transparent',
                          fontWeight: slug === 'cts-with-tritoncts' ? 500 : 400,
                        }}
                      >
                        {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Center - Doc Content */}
        <main className="flex-1 min-w-0 px-10 py-10">
          {isSearching ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--stone-ridge)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                  Search Results for "{search}"
                </h2>
                <span className="text-xs text-slate-500">{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-4 max-w-2xl">
                  {searchResults.map((result) => (
                    <Link
                      key={result.slug}
                      to={`/docs/${result.slug}`}
                      className="block p-5 rounded-2xl border bg-white hover:shadow-md transition-all group"
                      style={{ borderColor: 'var(--stone-ridge)' }}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        {result.breadcrumb.map((crumb, idx) => (
                          <span key={crumb} className="flex items-center gap-1">
                            {idx > 0 && <ChevronRight className="w-2.5 h-2.5" />}
                            <span>{crumb}</span>
                          </span>
                        ))}
                      </div>
                      <h3 className="text-sm font-semibold group-hover:text-amber-500 transition-colors" style={{ color: 'var(--abyss-ink)' }}>
                        {result.title}
                      </h3>
                      {result.matchSnippet && (
                        <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-editorial">
                          {result.matchSection && (
                            <span className="font-semibold block mb-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                              Section: {result.matchSection}
                            </span>
                          )}
                          <span className="italic">"{result.matchSnippet}"</span>
                        </div>
                      )}
                      <div className="mt-3 text-[10px] text-slate-400">
                        {result.readTime}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center max-w-md">
                  <p className="text-sm text-slate-505 font-editorial">No documentation pages matched your search query. Try searching for other terms like "synthesis", "CTS", "placement", or "SDC".</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#94A3B8' }}>
                {currentDoc.breadcrumb.map((crumb, i) => (
                  <span key={crumb} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    <span>{crumb}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-start gap-4 mb-2">
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--abyss-ink)' }}>
                  {currentDoc.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 mb-8 text-xs" style={{ color: '#94A3B8' }}>
                <span>Updated {currentDoc.lastUpdated}</span>
                <span>·</span>
                <span>{currentDoc.readTime}</span>
              </div>

              {/* Content */}
              <div className="space-y-8 max-w-2xl">
                {currentDoc.content.map((section, i) => (
                  <div key={i} id={section.heading.toLowerCase().replace(/\s/g, '-')}>
                    <h2 className="mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--abyss-ink)' }}>
                      {section.heading}
                    </h2>
                    <div className="prose text-sm leading-relaxed mb-4" style={{ color: '#475569', fontFamily: 'var(--font-editorial)', whiteSpace: 'pre-wrap' }}>
                      {section.body}
                    </div>
                    {section.code && (
                      <div className="rounded-lg overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161B22' }}>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{section.codeLanguage}</span>
                        </div>
                        <pre className="p-4 text-sm overflow-x-auto" style={{ fontFamily: 'var(--font-mono)', color: '#E6EDF3', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                          {section.code}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t max-w-2xl" style={{ borderColor: 'var(--stone-ridge)' }}>
                <Link to="#" className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  ← Placement with RePlAce
                </Link>
                <Link to="#" className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  Routing with FastRoute →
                </Link>
              </div>
            </>
          )}
        </main>

        {/* Right - TOC */}
        {!isSearching && (
          <aside className="w-52 shrink-0 border-l hidden lg:block sticky top-16 self-start" style={{ borderColor: 'var(--stone-ridge)', height: 'calc(100vh - 120px)', paddingTop: '1.5rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>On This Page</p>
            <div className="space-y-1">
              {currentDoc.toc.map(item => (
                <button
                  key={item}
                  onClick={() => setActiveToc(item)}
                  className="w-full text-left text-xs py-1.5 px-2 rounded transition-colors"
                  style={{
                    color: activeToc === item ? 'var(--abyss-ink)' : '#94A3B8',
                    fontWeight: activeToc === item ? 500 : 400,
                    background: activeToc === item ? 'rgba(15,23,42,0.05)' : 'transparent',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--stone-ridge)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Related</p>
              {['SDC Constraint Guide', 'OpenROAD API Docs', 'CTS Error Reference'].map(page => (
                <Link key={page} to="#" className="block text-xs py-1.5 hover:underline" style={{ color: '#64748B' }}>
                  {page}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
