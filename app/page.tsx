"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Download,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";

const metrics = [
  {
    title: "Actividad total",
    value: "1.284",
    change: "+12,8%",
    positive: true,
    icon: Activity,
    color: "blue",
    detail: "respecto al periodo anterior",
  },
  {
    title: "Procesos activos",
    value: "86",
    change: "+8,2%",
    positive: true,
    icon: Zap,
    color: "violet",
    detail: "procesos en ejecución",
  },
  {
    title: "Pendientes",
    value: "12",
    change: "-16,4%",
    positive: true,
    icon: Clock3,
    color: "orange",
    detail: "frente al periodo anterior",
  },
  {
    title: "Tareas completadas",
    value: "94,6%",
    change: "+5,3%",
    positive: true,
    icon: CheckCircle2,
    color: "green",
    detail: "tasa de finalización",
  },
];

const initialActivities = [
  {
    id: 1,
    title: "Proceso completado",
    description: "Actualización de datos de cliente",
    time: "Hace 2 minutos",
    status: "Completado",
    type: "success",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Nueva tarea automatizada",
    description: "Generación del informe semanal",
    time: "Hace 14 minutos",
    status: "En curso",
    type: "info",
    icon: Zap,
  },
  {
    id: 3,
    title: "Revisión necesaria",
    description: "Validación de un registro pendiente",
    time: "Hace 28 minutos",
    status: "Pendiente",
    type: "warning",
    icon: CircleAlert,
  },
  {
    id: 4,
    title: "Sincronización finalizada",
    description: "Conexión con el sistema de gestión",
    time: "Hace 46 minutos",
    status: "Completado",
    type: "success",
    icon: CheckCircle2,
  },
  {
    id: 5,
    title: "Nuevo proceso registrado",
    description: "Alta de una nueva solicitud",
    time: "Hace 1 hora",
    status: "En curso",
    type: "info",
    icon: Package,
  },
];

const chartData = [
  { day: "Lun", value: 42, previous: 29 },
  { day: "Mar", value: 66, previous: 45 },
  { day: "Mié", value: 53, previous: 38 },
  { day: "Jue", value: 82, previous: 54 },
  { day: "Vie", value: 68, previous: 46 },
  { day: "Sáb", value: 91, previous: 61 },
  { day: "Dom", value: 75, previous: 49 },
];

const initialTasks = [
  {
    id: 1,
    title: "Validar registros de clientes",
    department: "Administración",
    priority: "Alta",
    due: "Hoy",
    done: false,
  },
  {
    id: 2,
    title: "Revisar informe de actividad",
    department: "Operaciones",
    priority: "Media",
    due: "Hoy",
    done: false,
  },
  {
    id: 3,
    title: "Sincronizar base de datos",
    department: "Sistemas",
    priority: "Baja",
    due: "Mañana",
    done: true,
  },
];

type ActivityItem = (typeof initialActivities)[number];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [period, setPeriod] = useState("Últimos 7 días");
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [activities, setActivities] =
    useState<ActivityItem[]>(initialActivities);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const filteredActivities = activities.filter((activity) => {
    const text = `${activity.title} ${activity.description} ${activity.status}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const visibleActivities = showAllActivities
    ? filteredActivities
    : filteredActivities.slice(0, 4);

  const pendingTasks = tasks.filter((task) => !task.done).length;

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function markNotificationsRead() {
    setShowNotifications(false);
    setActivities((current) =>
      current.map((activity) =>
        activity.status === "Pendiente"
          ? { ...activity, status: "En curso", type: "info" }
          : activity,
      ),
    );
  }

  function exportReport() {
    const rows = [
      ["Tipo", "Nombre", "Descripción", "Estado", "Momento"],
      ...activities.map((activity) => [
        "Actividad",
        activity.title,
        activity.description,
        activity.status,
        activity.time,
      ]),
      ...tasks.map((task) => [
        "Tarea",
        task.title,
        task.department,
        task.done ? "Completada" : "Pendiente",
        task.due,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(";"),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transport-ai-informe.csv";
    link.click();
    URL.revokeObjectURL(url);

    setReportMessage("Informe exportado correctamente.");
    window.setTimeout(() => setReportMessage(""), 3000);
  }

  function addDemoActivity() {
    const newActivity: ActivityItem = {
      id: Date.now(),
      title: "Nueva actividad registrada",
      description: "Evento creado desde el dashboard de demostración",
      time: "Ahora mismo",
      status: "En curso",
      type: "info",
      icon: Activity,
    };

    setActivities((current) => [newActivity, ...current]);
    setActiveNav("Actividad");
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Actividad", icon: Activity },
    { label: "Procesos", icon: Zap },
    { label: "Tareas", icon: CheckCircle2 },
    { label: "Informes", icon: BriefcaseBusiness },
  ];

  return (
    <main className="dashboard-app">
      {mobileMenu && (
        <button
          className="mobile-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Activity size={23} strokeWidth={2.5} />
          </div>
          <div className="brand-copy">
            <span>TRANSPORT AI</span>
            <small>BUSINESS INTELLIGENCE</small>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Cerrar menú"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-icon">
            <BriefcaseBusiness size={18} />
          </div>
          <div className="workspace-copy">
            <strong>Mi empresa</strong>
            <span>Panel de operaciones</span>
          </div>
          <ChevronDown size={16} className="muted-icon" />
        </div>

        <div className="nav-label">PRINCIPAL</div>

        <nav className="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileMenu(false);
                  if (item.label === "Informes") {
                    setReportMessage(
                      "Consulta los datos y exporta tu informe desde el botón superior.",
                    );
                  } else {
                    setReportMessage("");
                  }
                }}
                className={`nav-item ${activeNav === item.label ? "nav-item-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{item.label}</span>
                {item.label === "Tareas" && pendingTasks > 0 && (
                  <span className="nav-count">{pendingTasks}</span>
                )}
                {item.label === "Procesos" && (
                  <span className="nav-count">86</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="nav-label tools-label">GESTIÓN</div>

        <nav className="navigation">
          <button
            className={`nav-item ${activeNav === "Equipo" ? "nav-item-active" : ""}`}
            onClick={() => setActiveNav("Equipo")}
          >
            <Users size={18} strokeWidth={1.9} />
            <span>Equipo</span>
          </button>
          <button
            className={`nav-item ${activeNav === "Flota" ? "nav-item-active" : ""}`}
            onClick={() => setActiveNav("Flota")}
          >
            <Truck size={18} strokeWidth={1.9} />
            <span>Flota y recursos</span>
          </button>
          <button
            className={`nav-item ${activeNav === "Configuración" ? "nav-item-active" : ""}`}
            onClick={() => setActiveNav("Configuración")}
          >
            <Settings size={18} strokeWidth={1.9} />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">
              <ShieldCheck size={20} />
            </div>
            <strong>Todo bajo control</strong>
            <p>Visualiza tus operaciones desde un único lugar.</p>
            <button onClick={() => setActiveNav("Informes")}>
              Ver informes <ArrowRight size={14} />
            </button>
          </div>

          <div className="sidebar-user">
            <div className="avatar">TA</div>
            <div className="user-copy">
              <strong>Administrador</strong>
              <span>Cuenta de demostración</span>
            </div>
            <MoreHorizontal size={19} className="muted-icon" />
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Abrir menú"
            >
              <Menu size={21} />
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{activeNav}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="Buscar actividad..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </label>

            <div className="dropdown-wrap">
              <button
                className={`icon-button notification-button ${showNotifications ? "icon-button-selected" : ""}`}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                aria-label="Notificaciones"
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              {showNotifications && (
                <div className="dropdown-panel notification-panel">
                  <div className="dropdown-heading">
                    <div>
                      <strong>Notificaciones</strong>
                      <span>Tus últimas novedades</span>
                    </div>
                    <button
                      className="text-button"
                      onClick={markNotificationsRead}
                    >
                      Marcar leídas
                    </button>
                  </div>
                  <div className="notification-entry">
                    <span className="notification-entry-icon green-bg">
                      <CheckCircle2 size={17} />
                    </span>
                    <div>
                      <strong>Proceso completado</strong>
                      <p>Una tarea se ha completado correctamente.</p>
                      <small>Hace 2 minutos</small>
                    </div>
                  </div>
                  <div className="notification-entry">
                    <span className="notification-entry-icon orange-bg">
                      <CircleAlert size={17} />
                    </span>
                    <div>
                      <strong>Revisión pendiente</strong>
                      <p>Hay tareas que necesitan tu atención.</p>
                      <small>Hace 28 minutos</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="dropdown-wrap">
              <button
                className="profile-button"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
              >
                <span className="avatar top-avatar">TA</span>
                <ChevronDown size={15} />
              </button>

              {showProfile && (
                <div className="dropdown-panel profile-panel">
                  <strong>Administrador</strong>
                  <span>demo@transport-ai.es</span>
                  <div className="profile-divider" />
                  <button onClick={() => setActiveNav("Configuración")}>
                    <Settings size={16} /> Configuración
                  </button>
                  <button onClick={() => setShowProfile(false)}>
                    <X size={16} /> Cerrar menú
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="demo-banner">
            <div className="demo-banner-icon">
              <Zap size={16} />
            </div>
            <span>
              DEMOSTRACIÓN INTERACTIVA <span className="demo-dot">•</span>{" "}
              Datos de ejemplo
            </span>
            <span className="demo-banner-right">
              <span className="live-dot" /> Panel activo
            </span>
          </div>

          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                BUSINESS OVERVIEW
              </div>
              <h1>
                {activeNav === "Dashboard"
                  ? "Resumen empresarial"
                  : activeNav}
              </h1>
              <p className="page-subtitle">
                Controla la actividad, supervisa tus procesos y toma decisiones
                con una visión global de tu negocio.
              </p>
            </div>

            <div className="heading-actions">
              <div className="date-chip">
                <CalendarDays size={16} />
                <span>21 oct. 2026</span>
              </div>
              <button className="primary-button" onClick={exportReport}>
                <Download size={16} />
                Exportar informe
              </button>
            </div>
          </div>

          {reportMessage && (
            <div className="inline-message">
              <CheckCircle2 size={17} />
              <span>{reportMessage}</span>
              <button
                className="icon-button"
                onClick={() => setReportMessage("")}
                aria-label="Cerrar aviso"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="metrics-grid">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article className="metric-card" key={metric.title}>
                  <div className="metric-top">
                    <span className="metric-title">{metric.title}</span>
                    <span className={`metric-icon metric-${metric.color}`}>
                      <Icon size={19} strokeWidth={2} />
                    </span>
                  </div>
                  <div className="metric-number-row">
                    <strong className="metric-number">{metric.value}</strong>
                    <span className="metric-change">
                      {metric.positive ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {metric.change}
                    </span>
                  </div>
                  <p className="metric-detail">{metric.detail}</p>
                  <div className="metric-bottom-line">
                    <span className={`metric-line metric-line-${metric.color}`} />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="main-grid">
            <section className="panel activity-chart-panel">
              <div className="panel-header">
                <div>
                  <h2>Actividad de operaciones</h2>
                  <p>Evolución de la actividad durante la semana</p>
                </div>
                <div className="period-select-wrap">
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    aria-label="Periodo del gráfico"
                  >
                    <option>Últimos 7 días</option>
                    <option>Últimos 30 días</option>
                    <option>Últimos 90 días</option>
                  </select>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="legend-dot legend-primary" />
                  Este periodo
                </span>
                <span>
                  <i className="legend-dot legend-secondary" />
                  Periodo anterior
                </span>
              </div>

              <div className="chart-area">
                <div className="chart-y-labels">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <div className="chart-plot">
                  <div className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <svg
                    className="chart-svg"
                    viewBox="0 0 700 220"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Gráfico de actividad semanal comparado con el periodo anterior"
                  >
                    <defs>
                      <linearGradient
                        id="activityFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#635bff" stopOpacity=".2" />
                        <stop
                          offset="100%"
                          stopColor="#635bff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 0 156 L 116 121 L 233 144 L 350 82 L 466 111 L 583 48 L 700 87 L 700 220 L 0 220 Z"
                      fill="url(#activityFill)"
                    />
                    <polyline
                      points="0,156 116,121 233,144 350,82 466,111 583,48 700,87"
                      fill="none"
                      stroke="#635bff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <polyline
                      points="0,184 116,165 233,175 350,139 466,157 583,119 700,145"
                      fill="none"
                      stroke="#b9bdcb"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {[
                      [0, 156],
                      [116, 121],
                      [233, 144],
                      [350, 82],
                      [466, 111],
                      [583, 48],
                      [700, 87],
                    ].map(([cx, cy], index) => (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill="#ffffff"
                        stroke="#635bff"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>

                  <div className="chart-x-labels">
                    {chartData.map((item) => (
                      <span key={item.day}>{item.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-footer">
                <div>
                  <span className="chart-footer-label">Actividad registrada</span>
                  <strong>1.284 eventos</strong>
                </div>
                <div className="chart-footer-right">
                  <span className="chart-footer-label">Tendencia semanal</span>
                  <strong className="trend-positive">
                    <ArrowUpRight size={16} /> +12,8%
                  </strong>
                </div>
              </div>
            </section>

            <section className="panel completion-panel">
              <div className="panel-header">
                <div>
                  <h2>Estado de procesos</h2>
                  <p>Distribución de la actividad</p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setActiveNav("Procesos")}
                  aria-label="Ver procesos"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="donut-wrapper">
                <svg viewBox="0 0 180 180" className="donut-chart">
                  <circle
                    cx="90"
                    cy="90"
                    r="65"
                    fill="none"
                    stroke="#eef0f6"
                    strokeWidth="16"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="65"
                    fill="none"
                    stroke="#635bff"
                    strokeWidth="16"
                    strokeDasharray="265 408"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="65"
                    fill="none"
                    stroke="#29b88a"
                    strokeWidth="16"
                    strokeDasharray="91 408"
                    strokeDashoffset="-276"
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="65"
                    fill="none"
                    stroke="#ffb454"
                    strokeWidth="16"
                    strokeDasharray="36 408"
                    strokeDashoffset="-374"
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                </svg>
                <div className="donut-center">
                  <strong>86</strong>
                  <span>Procesos</span>
                </div>
              </div>

              <div className="process-legend">
                <div className="process-legend-item">
                  <span className="process-legend-name">
                    <i className="legend-dot legend-primary" />
                    Completados
                  </span>
                  <strong>58</strong>
                </div>
                <div className="process-legend-item">
                  <span className="process-legend-name">
                    <i className="legend-dot legend-green" />
                    En curso
                  </span>
                  <strong>20</strong>
                </div>
                <div className="process-legend-item">
                  <span className="process-legend-name">
                    <i className="legend-dot legend-orange" />
                    Pendientes
                  </span>
                  <strong>8</strong>
                </div>
              </div>

              <button
                className="secondary-button full-button"
                onClick={() => setActiveNav("Procesos")}
              >
                Consultar procesos <ArrowRight size={15} />
              </button>
            </section>
          </div>

          <div className="lower-grid">
            <section className="panel recent-activity-panel">
              <div className="panel-header">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Últimos eventos registrados en el sistema</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setShowAllActivities(!showAllActivities)}
                >
                  {showAllActivities ? "Ver menos" : "Ver toda la actividad"}
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="activity-list">
                {visibleActivities.length === 0 ? (
                  <div className="empty-state">
                    No hay resultados para &quot;{search}&quot;.
                  </div>
                ) : (
                  visibleActivities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div className="activity-row" key={activity.id}>
                        <div className={`activity-icon activity-${activity.type}`}>
                          <Icon size={17} />
                        </div>
                        <div className="activity-description">
                          <strong>{activity.title}</strong>
                          <span>{activity.description}</span>
                        </div>
                        <span
                          className={`status-pill status-${activity.type}`}
                        >
                          <i />
                          {activity.status}
                        </span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <button className="add-activity-button" onClick={addDemoActivity}>
                <Activity size={15} />
                Registrar actividad de prueba
              </button>
            </section>

            <section className="panel tasks-panel">
              <div className="panel-header">
                <div>
                  <h2>Tareas pendientes</h2>
                  <p>Seguimiento de tareas del equipo</p>
                </div>
                <span className="task-counter">{pendingTasks} pendientes</span>
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <div
                    className={`task-row ${task.done ? "task-row-done" : ""}`}
                    key={task.id}
                  >
                    <button
                      className={`task-checkbox ${task.done ? "task-checkbox-checked" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.done
                          ? `Marcar ${task.title} como pendiente`
                          : `Completar ${task.title}`
                      }
                    >
                      {task.done && <Check size={13} />}
                    </button>
                    <div className="task-info">
                      <strong>{task.title}</strong>
                      <span>{task.department}</span>
                    </div>
                    <div className="task-meta">
                      <span
                        className={`priority priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                      <small>{task.due}</small>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="secondary-button full-button"
                onClick={() => setActiveNav("Tareas")}
              >
                Gestionar tareas <ArrowRight size={15} />
              </button>
            </section>
          </div>

          <section className="insight-banner">
            <div className="insight-icon">
              <Zap size={21} />
            </div>
            <div className="insight-copy">
              <strong>Más visibilidad. Mejores decisiones.</strong>
              <p>
                Centraliza los datos de tu empresa y detecta oportunidades de
                mejora desde un único panel de control.
              </p>
            </div>
            <button onClick={() => setActiveNav("Informes")}>
              Explorar informes <ArrowRight size={16} />
            </button>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 Transport AI. Todos los derechos reservados.</span>
            <div>
              <span>
                <span className="footer-status-dot" /> Sistema operativo
              </span>
              <span>Dashboard empresarial · Demo 08</span>
            </div>
          </footer>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");

        :root {
          --dash-bg: #f6f7fb;
          --dash-white: #ffffff;
          --dash-text: #191b2b;
          --dash-muted: #85899d;
          --dash-border: #eceef4;
          --dash-primary: #635bff;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: var(--dash-bg);
          font-family: "DM Sans", sans-serif;
          color: var(--dash-text);
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 3px solid rgba(99, 91, 255, 0.3);
          outline-offset: 2px;
        }

        .dashboard-app {
          min-height: 100vh;
          background: var(--dash-bg);
        }

        .sidebar {
          position: fixed;
          z-index: 40;
          top: 0;
          bottom: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          width: 254px;
          padding: 26px 16px 15px;
          background: #fff;
          border-right: 1px solid #ebeef5;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 7px;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          color: #fff;
          background: linear-gradient(145deg, #716aff, #5148eb);
          border-radius: 12px;
          box-shadow: 0 5px 12px #635bff35;
        }

        .brand-copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
        }

        .brand-copy > span {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.55px;
        }

        .brand-copy small {
          color: #9397aa;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.15px;
        }

        .icon-button {
          position: relative;
          display: inline-grid;
          place-items: center;
          flex-shrink: 0;
          width: 37px;
          height: 37px;
          padding: 0;
          color: #747990;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          transition: background 0.18s, color 0.18s;
        }

        .icon-button:hover,
        .icon-button-selected {
          color: #635bff;
          background: #f1f0ff;
        }

        .sidebar-close,
        .mobile-menu-button {
          display: none;
        }

        .workspace {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 34px;
          padding: 12px 10px;
          background: #fafaff;
          border: 1px solid #eeedff;
          border-radius: 12px;
        }

        .workspace-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          color: #635bff;
          background: #eceaff;
          border-radius: 9px;
        }

        .workspace-copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .workspace-copy strong {
          font-size: 12px;
          font-weight: 700;
        }

        .workspace-copy span {
          color: #9296a9;
          font-size: 10px;
        }

        .muted-icon {
          color: #a2a5b5;
        }

        .nav-label {
          margin: 31px 9px 12px;
          color: #9b9eb0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .navigation {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 43px;
          padding: 0 12px;
          color: #777b90;
          text-align: left;
          background: transparent;
          border: 0;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.18s, background 0.18s;
        }

        .nav-item:hover {
          color: #635bff;
          background: #f8f7ff;
        }

        .nav-item-active {
          color: #5e55f6;
          background: #efeeff;
          font-weight: 700;
        }

        .nav-item-active::before {
          position: absolute;
          left: 0;
          width: 3px;
          height: 27px;
          background: #635bff;
          border-radius: 0 4px 4px 0;
          content: "";
        }

        .nav-count {
          display: grid;
          place-items: center;
          min-width: 23px;
          height: 21px;
          margin-left: auto;
          padding: 0 6px;
          color: #85899e;
          background: #f2f3f8;
          border-radius: 6px;
          font-size: 10px;
        }

        .nav-item-active .nav-count {
          color: #635bff;
          background: #fff;
        }

        .tools-label {
          margin-top: 28px;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .support-card {
          padding: 17px 14px 15px;
          background: linear-gradient(145deg, #f7f6ff, #f9f9ff);
          border: 1px solid #eceaff;
          border-radius: 12px;
        }

        .support-icon {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          margin-bottom: 13px;
          color: #635bff;
          background: #e9e7ff;
          border-radius: 10px;
        }

        .support-card > strong {
          display: block;
          font-family: "Manrope", sans-serif;
          font-size: 12px;
        }

        .support-card p {
          margin: 7px 0 12px;
          color: #81859a;
          font-size: 10px;
          line-height: 1.7;
        }

        .support-card button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0;
          color: #635bff;
          background: transparent;
          border: 0;
          font-size: 11px;
          font-weight: 700;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          padding: 15px 4px 2px;
          border-top: 1px solid #eff0f5;
        }

        .avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          color: #5d55ed;
          background: #e9e7ff;
          border-radius: 11px;
          font-size: 11px;
          font-weight: 800;
        }

        .user-copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .user-copy strong {
          font-size: 11px;
        }

        .user-copy span {
          color: #9296a9;
          font-size: 9px;
        }

        .main-area {
          min-height: 100vh;
          margin-left: 254px;
        }

        .topbar {
          position: sticky;
          z-index: 20;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 72px;
          padding: 0 36px;
          background: rgba(255, 255, 255, 0.92);
          border-bottom: 1px solid #eceef4;
          backdrop-filter: blur(15px);
        }

        .topbar-left,
        .topbar-actions,
        .breadcrumb {
          display: flex;
          align-items: center;
        }

        .breadcrumb {
          gap: 11px;
          font-size: 12px;
        }

        .breadcrumb > span:first-child {
          color: #9296a8;
        }

        .breadcrumb-separator {
          color: #c3c5d0;
        }

        .breadcrumb strong {
          font-weight: 700;
        }

        .topbar-actions {
          gap: 13px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 250px;
          height: 37px;
          padding: 0 10px;
          color: #9699aa;
          background: #fafbfe;
          border: 1px solid #eceef4;
          border-radius: 9px;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          padding: 0;
          color: #303246;
          background: transparent;
          border: 0;
          outline: none;
          font-size: 11px;
        }

        .search-box input::placeholder {
          color: #a1a4b4;
        }

        .search-shortcut {
          flex-shrink: 0;
          padding: 3px 5px;
          color: #9296a8;
          background: #fff;
          border: 1px solid #e8eaf1;
          border-radius: 4px;
          font-size: 9px;
        }

        .notification-button {
          border-color: #eceef4;
        }

        .notification-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          background: #ff777f;
          border: 1.5px solid #fff;
          border-radius: 50%;
        }

        .dropdown-wrap {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          color: #8c90a2;
          background: transparent;
          border: 0;
        }

        .top-avatar {
          width: 34px;
          height: 34px;
        }

        .dropdown-panel {
          position: absolute;
          z-index: 60;
          top: calc(100% + 13px);
          right: 0;
          width: 300px;
          padding: 15px;
          background: #fff;
          border: 1px solid #e9ebf3;
          border-radius: 13px;
          box-shadow: 0 18px 45px #25274b14;
        }

        .dropdown-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 13px;
          border-bottom: 1px solid #eff0f5;
        }

        .dropdown-heading > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropdown-heading strong,
        .profile-panel > strong {
          font-size: 12px;
        }

        .dropdown-heading span,
        .profile-panel > span {
          color: #9296a9;
          font-size: 10px;
        }

        .text-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 5px 0;
          color: #635bff;
          background: transparent;
          border: 0;
          font-size: 10px;
          font-weight: 700;
        }

        .notification-entry {
          display: flex;
          gap: 10px;
          padding: 13px 0 4px;
        }

        .notification-entry-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 9px;
        }

        .green-bg {
          color: #22a77b;
          background: #e9f9f2;
        }

        .orange-bg {
          color: #e69b3c;
          background: #fff5e7;
        }

        .notification-entry strong {
          font-size: 11px;
        }

        .notification-entry p {
          margin: 5px 0;
          color: #82869a;
          font-size: 10px;
          line-height: 1.6;
        }

        .notification-entry small {
          color: #a0a3b1;
          font-size: 9px;
        }

        .profile-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 230px;
        }

        .profile-divider {
          height: 1px;
          margin: 8px 0;
          background: #eff0f5;
        }

        .profile-panel > button {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 5px;
          color: #656a80;
          text-align: left;
          background: transparent;
          border: 0;
          border-radius: 7px;
          font-size: 11px;
        }

        .profile-panel > button:hover {
          color: #635bff;
          background: #f7f6ff;
        }

        .page-content {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 26px 36px 22px;
        }

        .demo-banner {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 38px;
          padding: 0 12px;
          color: #6861e8;
          background: #f0efff;
          border: 1px solid #e8e6ff;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .demo-banner-icon {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          background: #e1dfff;
          border-radius: 6px;
        }

        .demo-dot {
          margin: 0 4px;
          color: #a6a0ff;
        }

        .demo-banner-right {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-left: auto;
          color: #7e81a0;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0;
        }

        .live-dot,
        .footer-status-dot {
          width: 7px;
          height: 7px;
          background: #26bd8b;
          border-radius: 50%;
          box-shadow: 0 0 0 3px #26bd8b1a;
        }

        .page-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin: 29px 0 25px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #7771e9;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .eyebrow-line {
          width: 18px;
          height: 2px;
          background: #7771e9;
          border-radius: 2px;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 8px;
          font-family: "Manrope", sans-serif;
          font-size: clamp(25px, 2.2vw, 31px);
          font-weight: 800;
          letter-spacing: -1.1px;
          line-height: 1.2;
        }

        .page-subtitle {
          max-width: 620px;
          margin-bottom: 0;
          color: #8b8fa3;
          font-size: 12px;
          line-height: 1.8;
        }

        .heading-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .date-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 12px;
          color: #747990;
          background: #fff;
          border: 1px solid #e9ebf3;
          border-radius: 9px;
          font-size: 10px;
        }

        .primary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          color: #fff;
          background: #635bff;
          border: 1px solid #635bff;
          border-radius: 9px;
          box-shadow: 0 4px 10px #635bff1b;
          font-size: 11px;
          font-weight: 700;
          transition: background 0.18s, transform 0.18s;
        }

        .primary-button:hover {
          background: #5048eb;
          transform: translateY(-1px);
        }

        .inline-message {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: -10px 0 20px;
          padding: 12px 14px;
          color: #278b6d;
          background: #ecfbf4;
          border: 1px solid #d7f4e7;
          border-radius: 9px;
          font-size: 11px;
        }

        .inline-message span {
          flex: 1;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 18px;
        }

        .metric-card {
          position: relative;
          overflow: hidden;
          min-width: 0;
          padding: 19px 19px 16px;
          background: #fff;
          border: 1px solid #eceef4;
          border-radius: 13px;
          box-shadow: 0 2px 5px #22244a03;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .metric-card:hover {
          box-shadow: 0 8px 22px #25274b08;
          transform: translateY(-2px);
        }

        .metric-top,
        .metric-number-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .metric-title {
          color: #777b91;
          font-size: 11px;
          font-weight: 500;
        }

        .metric-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
        }

        .metric-blue {
          color: #5c65ed;
          background: #efefff;
        }

        .metric-violet {
          color: #8c61e9;
          background: #f5edff;
        }

        .metric-orange {
          color: #e99d42;
          background: #fff5e8;
        }

        .metric-green {
          color: #25ac80;
          background: #e9f9f2;
        }

        .metric-number-row {
          justify-content: flex-start;
          gap: 12px;
          margin-top: 13px;
        }

        .metric-number {
          font-family: "Manrope", sans-serif;
          font-size: clamp(24px, 2.2vw, 30px);
          font-weight: 800;
          letter-spacing: -1px;
        }

        .metric-change {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 4px 5px;
          color: #22a579;
          background: #eaf9f2;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 700;
        }

        .metric-detail {
          margin: 7px 0 15px;
          color: #9a9daf;
          font-size: 10px;
        }

        .metric-bottom-line {
          overflow: hidden;
          width: 100%;
          height: 3px;
          background: #f1f2f8;
          border-radius: 5px;
        }

        .metric-line {
          display: block;
          height: 100%;
          border-radius: 5px;
        }

        .metric-line-blue {
          width: 78%;
          background: #635bff;
        }

        .metric-line-violet {
          width: 64%;
          background: #a275f4;
        }

        .metric-line-orange {
          width: 35%;
          background: #ffb454;
        }

        .metric-line-green {
          width: 94%;
          background: #29b88a;
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.85fr) minmax(260px, 1fr);
          gap: 18px;
          margin-bottom: 18px;
        }

        .panel {
          min-width: 0;
          padding: 21px;
          background: #fff;
          border: 1px solid #eceef4;
          border-radius: 13px;
          box-shadow: 0 2px 5px #22244a03;
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .panel-header h2 {
          margin-bottom: 6px;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.2px;
        }

        .panel-header p {
          margin-bottom: 0;
          color: #9599ac;
          font-size: 10px;
          line-height: 1.6;
        }

        .period-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: #7e8297;
        }

        .period-select-wrap select {
          max-width: 135px;
          padding: 9px 24px 9px 10px;
          color: #747990;
          appearance: none;
          background: #fff;
          border: 1px solid #eceef4;
          border-radius: 8px;
          outline-offset: 1px;
          font-size: 9px;
          cursor: pointer;
        }

        .period-select-wrap > svg {
          position: absolute;
          right: 8px;
          pointer-events: none;
        }

        .chart-legend {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 22px;
        }

        .chart-legend > span {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #8b8fa2;
          font-size: 10px;
        }

        .legend-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          background: #635bff;
          border-radius: 50%;
        }

        .legend-primary {
          background: #635bff;
        }

        .legend-secondary {
          background: #b9bdcb;
        }

        .legend-green {
          background: #29b88a;
        }

        .legend-orange {
          background: #ffb454;
        }

        .chart-area {
          display: flex;
          height: 222px;
          margin-top: 18px;
        }

        .chart-y-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 29px;
          padding: 0 0 24px;
          color: #a1a4b4;
          font-size: 9px;
        }

        .chart-plot {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 198px;
        }

        .chart-grid-lines {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .chart-grid-lines span {
          width: 100%;
          height: 1px;
          background: #eff0f6;
        }

        .chart-svg {
          position: absolute;
          inset: 0;
          overflow: visible;
          width: 100%;
          height: 100%;
        }

        .chart-x-labels {
          position: absolute;
          right: 0;
          bottom: -24px;
          left: 0;
          display: flex;
          justify-content: space-between;
          color: #999daf;
          font-size: 9px;
        }

        .chart-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 29px;
          padding-top: 15px;
          border-top: 1px solid #f0f1f6;
        }

        .chart-footer > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .chart-footer-label {
          color: #989caf;
          font-size: 9px;
        }

        .chart-footer strong {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 800;
        }

        .chart-footer-right {
          align-items: flex-end;
        }

        .chart-footer .trend-positive {
          display: flex;
          align-items: center;
          gap: 3px;
          color: #25a77c;
        }

        .donut-wrapper {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          margin: 11px auto 13px;
        }

        .donut-chart {
          display: block;
          width: 177px;
          max-width: 100%;
          height: auto;
          transform: rotate(0deg);
        }

        .donut-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .donut-center strong {
          font-family: "Manrope", sans-serif;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .donut-center span {
          color: #969aab;
          font-size: 10px;
        }

        .process-legend {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 5px;
        }

        .process-legend-item,
        .process-legend-name {
          display: flex;
          align-items: center;
        }

        .process-legend-item {
          justify-content: space-between;
          gap: 8px;
        }

        .process-legend-name {
          gap: 9px;
          color: #81859a;
          font-size: 10px;
        }

        .process-legend-item > strong {
          font-size: 11px;
        }

        .secondary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 37px;
          padding: 0 12px;
          color: #635bff;
          background: #f6f5ff;
          border: 1px solid #eeedff;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          transition: background 0.18s;
        }

        .secondary-button:hover {
          background: #eceaff;
        }

        .full-button {
          width: 100%;
          margin-top: 20px;
        }

        .lower-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(270px, 1fr);
          gap: 18px;
          margin-bottom: 18px;
        }

        .recent-activity-panel,
        .tasks-panel {
          padding: 21px;
        }

        .activity-list {
          margin-top: 14px;
        }

        .activity-row {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 59px;
          border-bottom: 1px solid #f0f1f6;
        }

        .activity-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 10px;
        }

        .activity-success {
          color: #25a77c;
          background: #eaf9f2;
        }

        .activity-info {
          color: #665df2;
          background: #efeeff;
        }

        .activity-warning {
          color: #e99d42;
          background: #fff5e8;
        }

        .activity-description {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .activity-description strong {
          overflow: hidden;
          font-size: 10px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .activity-description > span {
          overflow: hidden;
          color: #979bad;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          padding: 5px 7px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 600;
        }

        .status-pill i {
          width: 5px;
          height: 5px;
          background: currentColor;
          border-radius: 50%;
        }

        .status-success {
          color: #229e75;
          background: #eaf9f2;
        }

        .status-info {
          color: #645cf0;
          background: #f0efff;
        }

        .status-warning {
          color: #d99238;
          background: #fff5e7;
        }

        .activity-time {
          flex-shrink: 0;
          color: #a0a3b2;
          font-size: 9px;
          text-align: right;
        }

        .empty-state {
          padding: 28px 0;
          color: #9296a8;
          font-size: 11px;
          text-align: center;
        }

        .add-activity-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          padding: 7px 0;
          color: #635bff;
          background: transparent;
          border: 0;
          font-size: 10px;
          font-weight: 700;
        }

        .task-counter {
          padding: 6px 8px;
          color: #d28b32;
          background: #fff6e9;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        .task-list {
          margin-top: 14px;
        }

        .task-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f1f6;
        }

        .task-checkbox {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin-top: 1px;
          color: #fff;
          background: #fff;
          border: 1.5px solid #d9dbe7;
          border-radius: 5px;
          transition: background 0.18s, border 0.18s;
        }

        .task-checkbox:hover {
          border-color: #635bff;
        }

        .task-checkbox-checked {
          background: #635bff;
          border-color: #635bff;
        }

        .task-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .task-info strong {
          font-size: 10px;
          font-weight: 700;
          line-height: 1.5;
        }

        .task-info span {
          color: #969aac;
          font-size: 9px;
        }

        .task-row-done .task-info strong {
          color: #9b9eaf;
          text-decoration: line-through;
        }

        .task-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7px;
          flex-shrink: 0;
        }

        .priority {
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 700;
        }

        .priority-alta {
          color: #dc6868;
          background: #fff0f0;
        }

        .priority-media {
          color: #d28b32;
          background: #fff5e7;
        }

        .priority-baja {
          color: #269b75;
          background: #eaf9f2;
        }

        .task-meta small {
          color: #9a9daf;
          font-size: 9px;
        }

        .insight-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 23px;
          padding: 17px 19px;
          background: linear-gradient(105deg, #f0efff 0%, #f9f8ff 100%);
          border: 1px solid #e9e7ff;
          border-radius: 12px;
        }

        .insight-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 39px;
          height: 39px;
          color: #635bff;
          background: #e2e0ff;
          border-radius: 11px;
        }

        .insight-copy {
          flex: 1;
          min-width: 0;
        }

        .insight-copy strong {
          display: block;
          margin-bottom: 5px;
          font-family: "Manrope", sans-serif;
          font-size: 11px;
          font-weight: 800;
        }

        .insight-copy p {
          margin-bottom: 0;
          color: #8589a0;
          font-size: 10px;
          line-height: 1.6;
        }

        .insight-banner > button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding: 10px 12px;
          color: #635bff;
          background: #fff;
          border: 1px solid #e8e6ff;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .insight-banner > button:hover {
          background: #f7f6ff;
        }

        .dashboard-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 0 1px;
          color: #a1a4b3;
          font-size: 9px;
        }

        .dashboard-footer > div {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .dashboard-footer > div > span:first-child {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7e8397;
        }

        .footer-status-dot {
          width: 6px;
          height: 6px;
        }

        .mobile-backdrop {
          display: none;
        }

        @media (min-width: 1600px) {
          .page-content {
            padding-right: 48px;
            padding-left: 48px;
          }

          .topbar {
            padding-right: 48px;
            padding-left: 48px;
          }

          .metrics-grid {
            gap: 20px;
          }

          .metric-card {
            padding: 22px;
          }

          .panel {
            padding: 25px;
          }
        }

        @media (max-width: 1250px) {
          .sidebar {
            width: 225px;
          }

          .main-area {
            margin-left: 225px;
          }

          .page-content {
            padding-right: 24px;
            padding-left: 24px;
          }

          .topbar {
            padding-right: 24px;
            padding-left: 24px;
          }

          .metrics-grid {
            gap: 11px;
          }

          .metric-card {
            padding: 15px;
          }

          .metric-number-row {
            gap: 7px;
          }

          .metric-number {
            font-size: 25px;
          }

          .main-grid {
            grid-template-columns: minmax(0, 1.6fr) minmax(245px, 1fr);
            gap: 12px;
          }

          .lower-grid {
            grid-template-columns: minmax(0, 1.4fr) minmax(250px, 1fr);
            gap: 12px;
          }

          .panel {
            padding: 17px;
          }

          .activity-row {
            gap: 8px;
          }

          .activity-time {
            display: none;
          }
        }

        @media (max-width: 980px) {
          .sidebar {
            width: 225px;
            transform: translateX(-105%);
            transition: transform 0.25s ease;
            box-shadow: 15px 0 40px #25274b12;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          .sidebar-close {
            display: inline-grid;
          }

          .mobile-backdrop {
            position: fixed;
            z-index: 35;
            inset: 0;
            display: block;
            background: #17182d65;
            border: 0;
          }

          .main-area {
            margin-left: 0;
          }

          .mobile-menu-button {
            display: inline-grid;
            margin-right: 8px;
            border-color: #eceef4;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .metric-number {
            font-size: 28px;
          }

          .main-grid {
            grid-template-columns: minmax(0, 1.6fr) minmax(250px, 1fr);
          }

          .lower-grid {
            grid-template-columns: 1fr;
          }

          .activity-time {
            display: inline;
          }

          .search-box {
            width: 220px;
          }
        }

        @media (max-width: 700px) {
          .topbar {
            min-height: 62px;
            padding: 0 15px;
          }

          .topbar-actions {
            gap: 6px;
          }

          .breadcrumb {
            gap: 6px;
            font-size: 10px;
          }

          .search-box {
            width: 36px;
            height: 36px;
            justify-content: center;
            padding: 0;
            background: transparent;
            border-color: transparent;
          }

          .search-box input,
          .search-shortcut {
            display: none;
          }

          .search-box:focus-within {
            position: absolute;
            z-index: 25;
            right: 102px;
            left: 15px;
            width: auto;
            justify-content: flex-start;
            padding: 0 10px;
            background: #fff;
            border-color: #eceef4;
          }

          .search-box:focus-within input {
            display: block;
          }

          .search-box:focus-within .search-shortcut {
            display: none;
          }

          .top-avatar {
            width: 31px;
            height: 31px;
          }

          .notification-button {
            width: 33px;
            height: 33px;
          }

          .page-content {
            padding: 16px 14px 18px;
          }

          .demo-banner {
            min-height: 36px;
            gap: 7px;
            padding: 0 8px;
            font-size: 8px;
            letter-spacing: 0;
          }

          .demo-banner-icon {
            width: 21px;
            height: 21px;
          }

          .demo-banner-right {
            gap: 5px;
            font-size: 8px;
          }

          .page-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
            margin: 24px 0 19px;
          }

          h1 {
            font-size: 27px;
          }

          .page-subtitle {
            font-size: 11px;
          }

          .heading-actions {
            width: 100%;
          }

          .date-chip {
            flex: 1;
            justify-content: center;
            height: 39px;
          }

          .primary-button {
            flex: 1.2;
            padding: 0 9px;
            font-size: 10px;
          }

          .metrics-grid {
            gap: 10px;
            margin-bottom: 12px;
          }

          .metric-card {
            padding: 14px 12px 12px;
            border-radius: 11px;
          }

          .metric-title {
            max-width: 95px;
            font-size: 10px;
          }

          .metric-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
          }

          .metric-icon svg {
            width: 16px;
            height: 16px;
          }

          .metric-number-row {
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
          }

          .metric-number {
            font-size: 26px;
          }

          .metric-change {
            font-size: 8px;
          }

          .metric-detail {
            min-height: 24px;
            margin: 6px 0 10px;
            font-size: 9px;
            line-height: 1.5;
          }

          .main-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }

          .panel {
            padding: 16px 14px;
            border-radius: 11px;
          }

          .panel-header h2 {
            font-size: 12px;
          }

          .panel-header p {
            font-size: 9px;
          }

          .activity-chart-panel .panel-header {
            align-items: center;
          }

          .period-select-wrap select {
            max-width: 120px;
            font-size: 8px;
          }

          .chart-legend {
            gap: 13px;
            margin-top: 20px;
          }

          .chart-legend > span {
            font-size: 9px;
          }

          .chart-area {
            height: 208px;
            margin-top: 15px;
          }

          .chart-plot {
            height: 185px;
          }

          .chart-y-labels {
            padding-bottom: 24px;
            font-size: 8px;
          }

          .chart-x-labels {
            bottom: -23px;
            font-size: 8px;
          }

          .chart-footer {
            margin-top: 29px;
          }

          .donut-chart {
            width: 172px;
          }

          .completion-panel {
            padding-bottom: 17px;
          }

          .lower-grid {
            gap: 12px;
            margin-bottom: 12px;
          }

          .recent-activity-panel,
          .tasks-panel {
            padding: 16px 13px;
          }

          .recent-activity-panel .panel-header {
            align-items: center;
          }

          .recent-activity-panel .text-button {
            max-width: 110px;
            text-align: right;
            font-size: 9px;
          }

          .activity-row {
            gap: 8px;
            min-height: 61px;
          }

          .activity-icon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
          }

          .activity-icon svg {
            width: 15px;
            height: 15px;
          }

          .activity-description strong {
            font-size: 9px;
          }

          .activity-description > span {
            font-size: 8px;
          }

          .status-pill {
            gap: 4px;
            padding: 5px 5px;
            font-size: 8px;
          }

          .status-pill i {
            width: 4px;
            height: 4px;
          }

          .activity-time {
            display: none;
          }

          .task-counter {
            font-size: 8px;
          }

          .task-row {
            gap: 8px;
          }

          .task-info strong {
            font-size: 10px;
          }

          .insight-banner {
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 11px;
            padding: 14px;
            margin-bottom: 19px;
          }

          .insight-icon {
            width: 34px;
            height: 34px;
          }

          .insight-copy {
            flex: 1;
            min-width: calc(100% - 50px);
          }

          .insight-copy strong {
            font-size: 10px;
          }

          .insight-copy p {
            font-size: 9px;
          }

          .insight-banner > button {
            width: 100%;
            justify-content: center;
          }

          .dashboard-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
            font-size: 8px;
          }

          .dashboard-footer > div {
            flex-wrap: wrap;
            gap: 11px;
          }

          .dropdown-panel {
            position: fixed;
            top: 60px;
            right: 10px;
            width: min(300px, calc(100vw - 20px));
          }
        }

        @media (max-width: 370px) {
          .breadcrumb > span:first-child,
          .breadcrumb-separator {
            display: none;
          }

          .topbar {
            padding: 0 10px;
          }

          .page-content {
            padding-right: 10px;
            padding-left: 10px;
          }

          .metric-number {
            font-size: 23px;
          }

          .metric-change {
            padding: 3px;
          }

          .status-pill {
            font-size: 7px;
          }

          .demo-banner {
            font-size: 7px;
          }
        }
      `}</style>
    </main>
  );
}
