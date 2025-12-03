export const statistics = {
  overdue_tasks: 10,
  upcoming_tasks: 5,
  upcoming_meetings: 3,
};

export const scheduleToday = {
  date: "2025-12-03T00:00:00Z",
  tasks: [
    {
      id: 1,
      title: "خواندن فصل ۱ کتاب",
      description: "از صفحه ۱۰ تا ۳۰",
      time: "2025-12-03T10:00:00Z",
      is_done: false,
      category: {
        id: 1,
        title: "درس",
        color: "#FF5733",
      },
    },
    {
      id: 2,
      title: "انجام تمرین ریاضی",
      description: "تمرینات فصل ۲",
      time: "2025-12-03T14:00:00Z",
      is_done: true,
      category: {
        id: 1,
        title: "درس",
        color: "#FF5733",
      },
    },
  ],
  meetings: [
    {
      id: 1,
      title: "جلسه با استاد",
      description: "بحث درباره پروژه",
      start_time: "2025-12-03T09:00:00Z",
      end_time: "2025-12-03T10:00:00Z",
      category: {
        id: 2,
        title: "کار",
        color: "#33FF57",
      },
    },
  ],
  schedule: [
    {
      type: "meeting",
      id: 1,
      title: "جلسه با استاد",
      description: "بحث درباره پروژه",
      start_time: "2025-12-03T09:00:00Z",
      end_time: "2025-12-03T10:00:00Z",
      category: {
        id: 2,
        title: "کار",
        color: "#33FF57",
      },
    },
    {
      type: "task",
      id: 1,
      title: "خواندن فصل ۱ کتاب",
      description: "از صفحه ۱۰ تا ۳۰",
      time: "2025-12-03T10:00:00Z",
      category: {
        id: 1,
        title: "درس",
        color: "#FF5733",
      },
    },
    {
      type: "task",
      id: 2,
      title: "انجام تمرین ریاضی",
      description: "تمرینات فصل ۲",
      time: "2025-12-03T14:00:00Z",
      category: {
        id: 1,
        title: "درس",
        color: "#FF5733",
      },
    },
  ],
  total_items: 3,
};
