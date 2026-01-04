// Initialize Cytoscape with dagre layout
cytoscape.use(cytoscapeDagre);

// Tooltip element
let tooltip = null;

// Node descriptions for tooltips (using ACTUAL workflows)
const nodeDescriptions = {
    'bulkhead': {
        title: '/bulkhead',
        desc: 'Main orchestrator - Entry point for all work',
        artifacts: ['current_phase', 'audit.log']
    },
    'p0': {
        title: '/phase-0-triage',
        desc: 'Economic Control - Classify as MINOR/MAJOR/CRITICAL',
        artifacts: ['00-triage.md', '00-triage.json']
    },
    'p1': {
        title: '/phase-1-context',
        desc: 'Blast Radius - Document scope and impact',
        artifacts: ['01-context.md', '01-context.json']
    },
    'p2': {
        title: '/phase-2-design',
        desc: 'Architectural Analysis - Design the solution',
        artifacts: ['02-design.md', '02-design.json']
    },
    'p3': {
        title: '/phase-3-security',
        desc: 'Threat Modeling - Security risk analysis',
        artifacts: ['03-security.md', '03-security.json']
    },
    'p4': {
        title: '/phase-4-decision',
        desc: 'Human Gate - Strategic authorization required',
        artifacts: ['04-decision-record.md']
    },
    'p5': {
        title: '/phase-5-plan',
        desc: 'Orchestration - Detailed task planning',
        artifacts: ['05-plan.md', '05-plan.json']
    },
    'p6': {
        title: '/phase-6-execute',
        desc: 'Code Implementation',
        artifacts: ['06-report.md']
    },
    'p7': {
        title: '/phase-7-verify',
        desc: 'Quality Gate - Test and validate',
        artifacts: ['07-verify.md']
    },
    'review-arch': {
        title: '/review architecture',
        desc: 'Evaluate architectural options (mode of /spec-code-review)',
        purpose: 'Architecture validation'
    },
    'review-code': {
        title: '/review code',
        desc: 'Review PR for correctness and style (mode of /spec-code-review)',
        purpose: 'Code quality'
    },
    'review-sec': {
        title: '/review security',
        desc: 'Security audit and threat modeling (mode of /spec-code-review)',
        purpose: 'Security validation'
    },
    'checkpoint': {
        title: '/phase-checkpoint',
        desc: 'Validates all required artifacts exist',
        purpose: 'Artifact validation'
    },
    'status': {
        title: '/phase-status',
        desc: 'Dashboard showing current phase and progress',
        purpose: 'Status monitoring'
    },
    'spec-mod': {
        title: '/spec-modernization',
        desc: 'Evaluate legacy system, decide refactor vs rebuild',
        artifacts: ['modernization-plan.md', 'modernization-plan.json']
    },
    'epic-orch': {
        title: '/phase-epic-orchestrator',
        desc: 'Large codebase with multiple epics per phase',
        artifacts: ['project-progress.json']
    },
    'pr-mgr': {
        title: '/int-pr-manager',
        desc: 'Prompt user for PR creation and merge',
        purpose: 'PR management with confirmation'
    },
    'github': {
        title: '/int-github-project',
        desc: 'GitHub Project, Epic, and Issue management',
        purpose: 'Project tracking'
    },
    'changelog': {
        title: '/int-update-changelog',
        desc: 'Update CHANGELOG.md and commit',
        purpose: 'Documentation'
    },
    'refactor-exec': {
        title: '/spec-refactoring-executor',
        desc: 'Execute phased refactor plan with progress tracking',
        artifacts: ['refactor-progress.json']
    }
};

// Professional dark theme styling
const commonStyle = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'font-size': '10px',
            'font-weight': '600',
            'font-family': 'Inter, system-ui, sans-serif',
            'color': '#ffffff',
            'text-outline-color': 'data(bgColor)',
            'text-outline-width': 2,
            'background-color': 'data(bgColor)',
            'border-width': 2,
            'border-color': 'data(borderColor)',
            'width': 'label',
            'height': 'label',
            'padding': '14px',
            'shape': 'roundrectangle',
            'transition-property': 'background-color, border-color, width, height, opacity',
            'transition-duration': '0.3s'
        }
    },
    {
        selector: 'node:hover',
        style: {
            'border-width': 3,
            'border-color': '#f97316',
            'z-index': 999
        }
    },
    {
        selector: 'node[type="start"]',
        style: {
            'shape': 'ellipse',
            'background-color': '#10b981',
            'border-color': '#059669',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="end"]',
        style: {
            'shape': 'ellipse',
            'background-color': '#3b82f6',
            'border-color': '#2563eb',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="decision"]',
        style: {
            'shape': 'diamond',
            'background-color': '#f59e0b',
            'border-color': '#d97706',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="workflow"]',
        style: {
            'background-color': '#22c55e',
            'border-color': '#16a34a',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="phase"]',
        style: {
            'background-color': '#3b82f6',
            'border-color': '#2563eb',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="security"]',
        style: {
            'background-color': '#ef4444',
            'border-color': '#dc2626',
            'font-weight': 'bold',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'node[type="execution"]',
        style: {
            'background-color': '#8b5cf6',
            'border-color': '#7c3aed',
            'background-opacity': 0.9
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#475569',
            'target-arrow-color': '#64748b',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.2,
            'label': 'data(label)',
            'font-size': '9px',
            'font-weight': '500',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'color': '#94a3b8',
            'text-background-color': '#1e293b',
            'text-background-opacity': 0.9,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
        }
    },
    {
        selector: 'edge[type="reject"]',
        style: {
            'line-color': '#ef4444',
            'target-arrow-color': '#ef4444',
            'line-style': 'dashed',
            'line-dash-pattern': [6, 3]
        }
    },
    {
        selector: 'edge[type="fast"]',
        style: {
            'line-color': '#22c55e',
            'target-arrow-color': '#22c55e',
            'line-style': 'dashed',
            'width': 2.5
        }
    },
    {
        selector: '.highlighted',
        style: {
            'line-color': '#f97316',
            'target-arrow-color': '#f97316',
            'border-color': '#f97316',
            'border-width': 3,
            'z-index': 999
        }
    },
    {
        selector: '.dimmed',
        style: {
            'opacity': 0.25
        }
    }
];

// Scenario data with CORRECT workflows
const scenarios = [
    // Scenario 1: New Feature Development (Full SDLC)
    {
        nodes: [
            { data: { id: 'start', label: 'Feature\nRequest', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'bulkhead', label: '/bulkhead\nstart 0', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'p0', label: 'Phase 0\nTriage', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'classify', label: 'MINOR?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'p1', label: 'Phase 1\nContext', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'p2', label: 'Phase 2\nDesign', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'review-arch', label: '/review\narchitecture', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'p3', label: 'Phase 3\nSecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'review-sec', label: '/review\nsecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'p4', label: 'Phase 4\nDecision', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'checkpoint', label: '/phase-\ncheckpoint', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'p5', label: 'Phase 5\nPlan', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'p6', label: 'Phase 6\nExecute', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'p7', label: 'Phase 7\nVerify', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'review-code', label: '/review\ncode', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'pr-mgr', label: '/int-pr-\nmanager', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'done', label: 'Merged', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 'bulkhead' } },
            { data: { source: 'bulkhead', target: 'p0' } },
            { data: { source: 'p0', target: 'classify' } },
            { data: { source: 'classify', target: 'p5', label: 'Yes', type: 'fast' } },
            { data: { source: 'classify', target: 'p1', label: 'No' } },
            { data: { source: 'p1', target: 'p2' } },
            { data: { source: 'p2', target: 'review-arch' } },
            { data: { source: 'review-arch', target: 'p3' } },
            { data: { source: 'p3', target: 'review-sec' } },
            { data: { source: 'review-sec', target: 'p4' } },
            { data: { source: 'p4', target: 'checkpoint' } },
            { data: { source: 'checkpoint', target: 'p5' } },
            { data: { source: 'p5', target: 'p6' } },
            { data: { source: 'p6', target: 'p7' } },
            { data: { source: 'p7', target: 'review-code' } },
            { data: { source: 'review-code', target: 'pr-mgr' } },
            { data: { source: 'pr-mgr', target: 'done' } }
        ]
    },

    // Scenario 2: Legacy Modernization
    {
        nodes: [
            { data: { id: 'start', label: 'Legacy\nSystem', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'status', label: '/phase-\nstatus', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'spec-mod', label: '/spec-\nmodernization', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'assess', label: 'Assessment\n& Analysis', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'decision', label: 'Refactor or\nRebuild?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'refactor', label: 'REFACTOR', type: 'phase', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'rebuild', label: 'REBUILD', type: 'phase', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'ref-exec', label: '/spec-refact\nexecutor', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'bulkhead', label: '/bulkhead\nRebuild SDLC', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'done', label: 'Modernized', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 'status' } },
            { data: { source: 'status', target: 'spec-mod' } },
            { data: { source: 'spec-mod', target: 'assess' } },
            { data: { source: 'assess', target: 'decision' } },
            { data: { source: 'decision', target: 'refactor', label: 'Refactor' } },
            { data: { source: 'decision', target: 'rebuild', label: 'Rebuild' } },
            { data: { source: 'refactor', target: 'ref-exec' } },
            { data: { source: 'rebuild', target: 'bulkhead' } },
            { data: { source: 'ref-exec', target: 'done' } },
            { data: { source: 'bulkhead', target: 'done' } }
        ]
    },

    // Scenario 3: Security-First Infrastructure
    {
        nodes: [
            { data: { id: 'start', label: 'Infra\nChange', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'p0', label: 'Phase 0\nTriage', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'p1', label: 'Phase 1\nBlast Radius', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'p2', label: 'Phase 2\nDesign', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'infra1', label: 'INFRA-1\nExplicit?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'p3', label: 'Phase 3\nSecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'review-sec', label: '/review\nsecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'infra5', label: 'INFRA-5\nNetwork?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'deep', label: 'Deep\nReview', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'infra4', label: 'INFRA-4\nSecrets?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'p4', label: 'Phase 4\nHuman Gate', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'proceed', label: 'Phase 5-7\nExecution', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'done', label: 'Deployed', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'stop', label: 'Blocked', type: 'end', bgColor: '#ef4444', borderColor: '#dc2626' } }
        ],
        edges: [
            { data: { source: 'start', target: 'p0' } },
            { data: { source: 'p0', target: 'p1' } },
            { data: { source: 'p1', target: 'p2' } },
            { data: { source: 'p2', target: 'infra1' } },
            { data: { source: 'infra1', target: 'p2', label: 'Defaults', type: 'reject' } },
            { data: { source: 'infra1', target: 'p3', label: 'Explicit' } },
            { data: { source: 'p3', target: 'review-sec' } },
            { data: { source: 'review-sec', target: 'infra5' } },
            { data: { source: 'infra5', target: 'deep', label: 'Yes' } },
            { data: { source: 'infra5', target: 'infra4', label: 'No' } },
            { data: { source: 'deep', target: 'infra4' } },
            { data: { source: 'infra4', target: 'p3', label: 'Inline', type: 'reject' } },
            { data: { source: 'infra4', target: 'p4', label: 'OK' } },
            { data: { source: 'p4', target: 'stop', label: 'No', type: 'reject' } },
            { data: { source: 'p4', target: 'proceed', label: 'Yes' } },
            { data: { source: 'proceed', target: 'done' } }
        ]
    },

    // Scenario 4: Continuous Development
    {
        nodes: [
            { data: { id: 'start', label: 'Developer\nReady', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'status', label: '/phase-\nstatus', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'check', label: 'Current\nPhase?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'new', label: '/bulkhead\nstart 0', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'continue', label: '/bulkhead\ncontinue', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'checkpoint', label: '/phase-\ncheckpoint', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'github', label: '/int-github\nproject', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'execute', label: 'Phase 6\nCode', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'verify', label: 'Phase 7\nVerify', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'review', label: '/review\ncode', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'pr', label: '/int-pr-\nmanager', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'merge', label: 'Merged', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 'status' } },
            { data: { source: 'status', target: 'check' } },
            { data: { source: 'check', target: 'new', label: 'None' } },
            { data: { source: 'check', target: 'continue', label: 'Active' } },
            { data: { source: 'new', target: 'checkpoint' } },
            { data: { source: 'continue', target: 'checkpoint' } },
            { data: { source: 'checkpoint', target: 'github' } },
            { data: { source: 'github', target: 'execute' } },
            { data: { source: 'execute', target: 'verify' } },
            { data: { source: 'verify', target: 'review' } },
            { data: { source: 'review', target: 'pr' } },
            { data: { source: 'pr', target: 'merge' } },
            { data: { source: 'merge', target: 'status', type: 'fast' } }
        ]
    },

    // Scenario 5: Parallel Work
    {
        nodes: [
            { data: { id: 'start', label: 'Multiple\nTeams', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 't1', label: 'Team A\nFeature', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 't2', label: 'Team B\nFeature', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 't3', label: 'Team C\nAudit', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'b1', label: '/bulkhead\nFeature A', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'b2', label: '/bulkhead\nFeature B', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'sec', label: '/review\nsecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'github', label: '/int-github\nproject', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'pr1', label: 'PR A', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'pr2', label: 'PR B', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'release', label: 'Release', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 't1' } },
            { data: { source: 'start', target: 't2' } },
            { data: { source: 'start', target: 't3' } },
            { data: { source: 't1', target: 'b1' } },
            { data: { source: 't2', target: 'b2' } },
            { data: { source: 't3', target: 'sec' } },
            { data: { source: 'b1', target: 'github' } },
            { data: { source: 'b2', target: 'github' } },
            { data: { source: 'github', target: 'pr1' } },
            { data: { source: 'github', target: 'pr2' } },
            { data: { source: 'sec', target: 'release' } },
            { data: { source: 'pr1', target: 'release' } },
            { data: { source: 'pr2', target: 'release' } }
        ]
    },

    // Scenario 6: Emergency Response
    {
        nodes: [
            { data: { id: 'start', label: 'Production\nIssue', type: 'start', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'severity', label: 'Severity?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'std', label: '/bulkhead\nStandard', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'fast', label: 'Condensed\nP0+P1+P2', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'infra', label: 'Infra\nChange?', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'infra5', label: 'INFRA-5\nNo Fast-Track', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'sec-fast', label: 'Fast\nSecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'sec-full', label: '/review\nsecurity', type: 'security', bgColor: '#ef4444', borderColor: '#dc2626' } },
            { data: { id: 'p4', label: 'Phase 4\nGate', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'impl', label: 'Quick\nImpl', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'verify', label: 'Phase 7\nVerify', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'deploy', label: 'Hotfix\nDeployed', type: 'end', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'stop', label: 'Blocked', type: 'end', bgColor: '#ef4444', borderColor: '#dc2626' } }
        ],
        edges: [
            { data: { source: 'start', target: 'severity' } },
            { data: { source: 'severity', target: 'std', label: 'P1-P2' } },
            { data: { source: 'severity', target: 'fast', label: 'P0' } },
            { data: { source: 'fast', target: 'infra' } },
            { data: { source: 'infra', target: 'infra5', label: 'Yes' } },
            { data: { source: 'infra', target: 'sec-fast', label: 'No' } },
            { data: { source: 'infra5', target: 'sec-full' } },
            { data: { source: 'sec-fast', target: 'p4', label: 'OK', type: 'fast' } },
            { data: { source: 'sec-fast', target: 'sec-full', label: 'Issues', type: 'reject' } },
            { data: { source: 'sec-full', target: 'p4' } },
            { data: { source: 'p4', target: 'stop', label: 'No', type: 'reject' } },
            { data: { source: 'p4', target: 'impl', label: 'Yes' } },
            { data: { source: 'impl', target: 'verify' } },
            { data: { source: 'verify', target: 'deploy' } },
            { data: { source: 'std', target: 'deploy' } }
        ]
    },

    // Scenario 7: Refactoring Decision
    {
        nodes: [
            { data: { id: 'start', label: 'Legacy\nIssues', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'spec-mod', label: '/spec-\nmodernization', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'stage1', label: 'Stage 1\nAssessment', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'metrics', label: 'Calculate\nMetrics', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'decision', label: 'Stage 2\nDecision', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'ref', label: 'Stage 3a\nRefactor Plan', type: 'phase', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'reb', label: 'Stage 3b\nRebuild Plan', type: 'phase', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'ref-exec', label: '/spec-refact\nexecutor', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'bulkhead', label: '/bulkhead\nNew System', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'done', label: 'Complete', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 'spec-mod' } },
            { data: { source: 'spec-mod', target: 'stage1' } },
            { data: { source: 'stage1', target: 'metrics' } },
            { data: { source: 'metrics', target: 'decision' } },
            { data: { source: 'decision', target: 'ref', label: 'REFACTOR' } },
            { data: { source: 'decision', target: 'reb', label: 'REBUILD' } },
            { data: { source: 'ref', target: 'ref-exec' } },
            { data: { source: 'reb', target: 'bulkhead' } },
            { data: { source: 'ref-exec', target: 'done' } },
            { data: { source: 'bulkhead', target: 'done' } }
        ]
    },

    // Scenario 8: Large Codebase Phased Development
    {
        nodes: [
            { data: { id: 'start', label: 'Large\nCodebase', type: 'start', bgColor: '#10b981', borderColor: '#059669' } },
            { data: { id: 'spec-mod', label: '/spec-\nmodernization', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'plan', label: 'Create\nPlan', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'epic-orch', label: '/phase-epic\norchestrator', type: 'workflow', bgColor: '#22c55e', borderColor: '#16a34a' } },
            { data: { id: 'p1', label: 'Phase P1\nInfra', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'e1', label: 'Epic 1.1\nSDLC 0-7', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'e2', label: 'Epic 1.2\nSDLC 0-7', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'gate1', label: 'P1\nGate', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'p2', label: 'Phase P2\nCore', type: 'phase', bgColor: '#3b82f6', borderColor: '#2563eb' } },
            { data: { id: 'e3', label: 'Epic 2.1\nSDLC 0-7', type: 'execution', bgColor: '#8b5cf6', borderColor: '#7c3aed' } },
            { data: { id: 'gate2', label: 'P2\nGate', type: 'decision', bgColor: '#f59e0b', borderColor: '#d97706' } },
            { data: { id: 'done', label: 'Project\nComplete', type: 'end', bgColor: '#3b82f6', borderColor: '#2563eb' } }
        ],
        edges: [
            { data: { source: 'start', target: 'spec-mod' } },
            { data: { source: 'spec-mod', target: 'plan' } },
            { data: { source: 'plan', target: 'epic-orch' } },
            { data: { source: 'epic-orch', target: 'p1' } },
            { data: { source: 'p1', target: 'e1' } },
            { data: { source: 'p1', target: 'e2' } },
            { data: { source: 'e1', target: 'gate1' } },
            { data: { source: 'e2', target: 'gate1' } },
            { data: { source: 'gate1', target: 'p2', label: 'All Done' } },
            { data: { source: 'gate1', target: 'p1', label: 'Pending', type: 'reject' } },
            { data: { source: 'p2', target: 'e3' } },
            { data: { source: 'e3', target: 'gate2' } },
            { data: { source: 'gate2', target: 'done', label: 'Complete' } }
        ]
    }
];

// Initialize all Cytoscape instances
let cyInstances = [];

// Create tooltip element
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'cy-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        display: none;
        background: rgba(15, 23, 42, 0.98);
        color: white;
        padding: 14px 18px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.6;
        max-width: 280px;
        z-index: 9999;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.2);
        pointer-events: none;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

// Export function
function exportDiagram(index, format) {
    const cy = cyInstances[index];
    if (!cy) return;

    if (format === 'png') {
        const blob = cy.png({ output: 'blob', full: true, bg: '#0f172a', scale: 2 });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulkhead-scenario-${index + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'svg') {
        const svgStr = cy.svg({ full: true, bg: '#0f172a' });
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulkhead-scenario-${index + 1}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Highlight connected path
function highlightPath(cy, node) {
    cy.elements().removeClass('highlighted dimmed');
    const connectedEdges = node.connectedEdges();
    const connectedNodes = connectedEdges.connectedNodes();
    node.addClass('highlighted');
    connectedEdges.addClass('highlighted');
    connectedNodes.addClass('highlighted');
    cy.elements().not(node).not(connectedEdges).not(connectedNodes).addClass('dimmed');
}

function resetHighlight(cy) {
    cy.elements().removeClass('highlighted dimmed');
}

// Fullscreen toggle
function toggleFullscreen(container, cy) {
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            setTimeout(() => { cy.resize(); cy.fit(); }, 100);
            container.style.backgroundColor = '#0f172a';
        });
    } else {
        document.exitFullscreen().then(() => {
            setTimeout(() => { cy.resize(); cy.fit(); }, 100);
        });
    }
}

function initCytoscape(containerId, scenarioIndex) {
    const scenario = scenarios[scenarioIndex];
    const cy = cytoscape({
        container: document.getElementById(containerId),
        elements: { nodes: scenario.nodes, edges: scenario.edges },
        style: commonStyle,
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 40,
            rankSep: 60,
            padding: 40
        },
        minZoom: 0.3,
        maxZoom: 2.5,
        wheelSensitivity: 0.15
    });

    let tooltip = document.getElementById('cy-tooltip') || createTooltip();

    cy.on('mouseover', 'node', function (evt) {
        const node = evt.target;
        const nodeId = node.data('id');
        highlightPath(cy, node);

        const info = nodeDescriptions[nodeId];
        if (info) {
            let content = `<div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #f97316;">${info.title || node.data('label').replace(/\n/g, ' ')}</div>`;
            content += `<div style="color: #e2e8f0; margin-bottom: 10px;">${info.desc || ''}</div>`;

            if (info.artifacts) {
                content += `<div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Artifacts:</div>`;
                info.artifacts.forEach(a => {
                    content += `<div style="font-size: 11px; color: #a78bfa; font-family: 'SF Mono', monospace;">• ${a}</div>`;
                });
            }
            if (info.purpose) {
                content += `<div style="margin-top: 8px; font-size: 11px; padding: 6px 10px; background: rgba(249, 115, 22, 0.15); border-radius: 6px; color: #fb923c;">${info.purpose}</div>`;
            }

            tooltip.innerHTML = content;
            tooltip.style.display = 'block';
        }
    });

    cy.on('mousemove', function (evt) {
        if (tooltip.style.display === 'block') {
            tooltip.style.left = (evt.originalEvent.clientX + 15) + 'px';
            tooltip.style.top = (evt.originalEvent.clientY + 15) + 'px';
        }
    });

    cy.on('mouseout', 'node', function () {
        resetHighlight(cy);
        tooltip.style.display = 'none';
    });

    cy.on('tap', 'node', function (evt) {
        cy.animate({ center: { eles: evt.target }, zoom: 1.8, duration: 400, easing: 'ease-out-cubic' });
    });

    // Add control buttons
    const container = document.getElementById(containerId);
    const controls = document.createElement('div');
    controls.style.cssText = 'position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; z-index: 100;';

    const btnStyle = `
        padding: 6px 10px;
        background: rgba(30, 41, 59, 0.9);
        color: #94a3b8;
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        backdrop-filter: blur(4px);
    `;

    const createBtn = (text, onClick) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = btnStyle;
        btn.onmouseover = () => { btn.style.background = '#f97316'; btn.style.color = '#fff'; btn.style.borderColor = '#f97316'; };
        btn.onmouseout = () => { btn.style.background = 'rgba(30, 41, 59, 0.9)'; btn.style.color = '#94a3b8'; btn.style.borderColor = 'rgba(71, 85, 105, 0.5)'; };
        btn.onclick = onClick;
        return btn;
    };

    controls.appendChild(createBtn('⛶ Fullscreen', () => toggleFullscreen(container, cy)));
    controls.appendChild(createBtn('↻ Reset', () => cy.fit()));
    controls.appendChild(createBtn('📥 PNG', () => exportDiagram(scenarioIndex, 'png')));

    container.style.position = 'relative';
    container.appendChild(controls);

    return cy;
}

function showTab(index) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${index}`).classList.add('active');
    document.querySelectorAll('.tab-button')[index].classList.add('active');

    if (!cyInstances[index]) {
        cyInstances[index] = initCytoscape(`cy-${index}`, index);
    } else {
        cyInstances[index].resize();
        cyInstances[index].fit();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    cyInstances[0] = initCytoscape('cy-0', 0);
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.querySelectorAll('.cy-container').forEach(c => c.style.backgroundColor = '');
    }
});
