import { FullTest } from "@/types";

export const mockTests: FullTest[] = [
  {
    id: "sat-practice-1",
    testType: "SAT",
    name: "SAT Practice Test #1",
    sections: [
      {
        subject: "SAT_Reading",
        duration: 65,
        questions: [
          "sat-r-1",
          "sat-r-2",
          "sat-r-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Writing",
        duration: 35,
        questions: [
          "sat-w-1",
          "sat-w-2",
          "sat-w-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Math_No_Calc",
        duration: 25,
        questions: [
          "sat-mnc-1",
          "sat-mnc-2",
          "sat-mnc-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Math_Calc",
        duration: 55,
        questions: [
          "sat-mc-1",
          "sat-mc-2",
          "sat-mc-3",
          // In a real app, this would include many more questions
        ],
      },
    ],
    totalDuration: 180,
  },
  {
    id: "sat-practice-2",
    testType: "SAT",
    name: "SAT Practice Test #2",
    sections: [
      {
        subject: "SAT_Reading",
        duration: 65,
        questions: [
          "sat-r-1",
          "sat-r-2",
          "sat-r-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Writing",
        duration: 35,
        questions: [
          "sat-w-1",
          "sat-w-2",
          "sat-w-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Math_No_Calc",
        duration: 25,
        questions: [
          "sat-mnc-1",
          "sat-mnc-2",
          "sat-mnc-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "SAT_Math_Calc",
        duration: 55,
        questions: [
          "sat-mc-1",
          "sat-mc-2",
          "sat-mc-3",
          // In a real app, this would include many more questions
        ],
      },
    ],
    totalDuration: 180,
  },
  {
    id: "act-practice-1",
    testType: "ACT",
    name: "ACT Practice Test #1",
    sections: [
      {
        subject: "ACT_English",
        duration: 45,
        questions: [
          "act-e-1",
          "act-e-2",
          "act-e-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Math",
        duration: 60,
        questions: [
          "act-m-1",
          "act-m-2",
          "act-m-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Reading",
        duration: 35,
        questions: [
          "act-r-1",
          "act-r-2",
          "act-r-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Science",
        duration: 35,
        questions: [
          "act-s-1",
          "act-s-2",
          "act-s-3",
          // In a real app, this would include many more questions
        ],
      },
    ],
    totalDuration: 175,
  },
  {
    id: "act-practice-2",
    testType: "ACT",
    name: "ACT Practice Test #2",
    sections: [
      {
        subject: "ACT_English",
        duration: 45,
        questions: [
          "act-e-1",
          "act-e-2",
          "act-e-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Math",
        duration: 60,
        questions: [
          "act-m-1",
          "act-m-2",
          "act-m-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Reading",
        duration: 35,
        questions: [
          "act-r-1",
          "act-r-2",
          "act-r-3",
          // In a real app, this would include many more questions
        ],
      },
      {
        subject: "ACT_Science",
        duration: 35,
        questions: [
          "act-s-1",
          "act-s-2",
          "act-s-3",
          // In a real app, this would include many more questions
        ],
      },
    ],
    totalDuration: 175,
  },
];