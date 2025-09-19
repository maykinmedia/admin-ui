export const FIXTURE_TODOS = [
  {
    id: 1,
    title: "Complete documentation for new feature",
    url: "https://www.example.com/todos/1",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-11-01",
    priority: "High",
    description:
      "Complete the documentation for the new feature implementation.",
    status: "In_Progress",
  },
  {
    id: 2,
    title: "Review and merge pull requests",
    url: "https://www.example.com/todos/2",
    thumbnailURl: "/static/maykin_logo.png",
    completed: true,
    dueDate: "2024-10-10",
    priority: "Medium",
    description: "Review the pull requests and merge if everything looks good.",
    status: "Done",
  },
  {
    id: 3,
    title: "Fix minor bugs from user feedback",
    url: "https://www.example.com/todos/3",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-10-20",
    priority: "Low",
    description: "Fix the minor bugs reported in the user feedback.",
    status: "Todo",
  },
  {
    id: 4,
    title: "Prepare quarterly financial report",
    url: "https://www.example.com/todos/4",
    thumbnailURl: "/static/maykin_logo.png",
    completed: true,
    dueDate: "2024-09-30",
    priority: "High",
    description: "Prepare the quarterly financial report for the team meeting.",
    status: "Done",
  },
  {
    id: 5,
    title: "Organize and archive older project files",
    url: "https://www.example.com/todos/5",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-11-15",
    priority: "Low",
    description:
      "Organize and archive older project files to save storage space.",
    status: "In_Review",
  },
  {
    id: 6,
    title: "Conduct developer interviews",
    url: "https://www.example.com/todos/6",
    thumbnailURl: "/static/maykin_logo.png",
    completed: true,
    dueDate: "2024-10-12",
    priority: "Medium",
    description: "Conduct interviews for the new developer positions.",
    status: "Done",
  },
  {
    id: 7,
    title: "Draft client project proposal",
    url: "https://www.example.com/todos/7",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-11-05",
    priority: "High",
    description: "Draft the proposal for the new client project.",
    status: "In_Progress",
  },
  {
    id: 8,
    title: "Update website with new content",
    url: "https://www.example.com/todos/8",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-12-01",
    priority: "Medium",
    description:
      "Update the company website with the latest blog posts and testimonials.",
    status: "Todo",
  },
  {
    id: 9,
    title: "Approve marketing materials",
    url: "https://www.example.com/todos/9",
    thumbnailURl: "/static/maykin_logo.png",
    completed: true,
    dueDate: "2024-10-08",
    priority: "Low",
    description:
      "Review and approve the marketing materials for the product launch.",
    status: "Done",
  },
  {
    id: 10,
    title: "Plan team-building event",
    url: "https://www.example.com/todos/10",
    thumbnailURl: "/static/maykin_logo.png",
    completed: false,
    dueDate: "2024-10-25",
    priority: "High",
    description: "Plan the upcoming team-building event and book the venue.",
    status: "Todo",
  },
];

export const FIXTURE_TODOS_STATUS_TODO = FIXTURE_TODOS.filter(
  (t) => t.status.toLowerCase() === "todo",
);

export const FIXTURE_TODOS_STATUS_IN_PROGRESS = FIXTURE_TODOS.filter(
  (t) => t.status.toLowerCase() === "in_progress",
);

export const FIXTURE_TODOS_STATUS_IN_REVIEW = FIXTURE_TODOS.filter(
  (t) => t.status.toLowerCase() === "in_review",
);

export const FIXTURE_TODOS_STATUS_DONE = FIXTURE_TODOS.filter(
  (t) => t.status.toLowerCase() === "done",
);
