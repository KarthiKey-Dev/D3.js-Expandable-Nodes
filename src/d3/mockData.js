
export const DATASET_2 = {
  nodes: [
    {
      id: 1,
      type: "parent",
      data: {
        name: "parent",
      },
    },
    {
      id: 2,
      type: "child",
      data: {
        name: "child-1",
        children: [
          {
            name: "child-1-1",
          },
          {
            name: "child-1-2",
          },
          {
            name: "child-1-3",
          },
        ],
      },
      edges: [
        { source: "child-1-1", target: "child-1-2" },
        { source: "child-1-1", target: "child-1-3" },
      ],
    },
    {
      id: 3,
      type: "child",
      data: {
        name: "child-2",
        children: [
          {
            name: "child-2-1",
          },
          {
            name: "child-2-2",
          },
          {
            name: "child-2-3",
          },
          {
            name: "child-2-4",
          },
          {
            name: "child-2-5",
          },
          {
            name: "child-2-6",
          },
        ],
      },
      edges: [
        {
          source: "child-2-1",
          target: "child-2-2",
        },

        {
          source: "child-2-3",
          target: "child-2-5",
        },
        {
          source: "child-2-5",
          target: "child-2-6",
        },
      ],
    },
    {
      id: 4,
      type: "child",
      data: {
        name: "child-3",
        children: [
          {
            name: "child-3-1",
          },
          {
            name: "child-3-2",
          },
          {
            name: "child-3-3",
          },
        ],
      },
      show: true,
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: 1,
      target: 2,
      show: true,
    },
    // {
    //   id: "e1-3",
    //   source: 2,
    //   target: 1,
    //   show: true,
    // },
    {
      id: "e1-2",
      source: 1,
      target: 3,
      show: true,
    },
    {
      id: "e1-2",
      source: 1,
      target: 4,
      show: true,
    },
    // {
    //   id: "e1-2",
    //   source: 4,
    //   target: 1,
    //   show: true,
    // },
  ],
};

export const DATASET_PACK = {
  name: "Root",
  children: [
    {
      name: "Category 1",
      value: 20,
    },
    {
      name: "Category 2",
      value: 15,
    },
    {
      name: "Category 3",
      value: 10,
    },
    {
      name: "Category 4",
      value: 5,
    },
  ],
};

export const DATASET_PACK_2 = {
  name: "A1",
  children: [
    {
      name: "C1",
      value: 100,
    },
    {
      name: "C2",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
    {
      name: "C3",
      value: 100,
    },
  ],
};

export const DATASET_PACK_3 = {
  name: "A1",
  children: [
    {
      name: "B1",
      children: [
        {
          name: "C1",
          value: 100,
        },
        {
          name: "C2",
          value: 100,
        },
        {
          name: "C3",
          value: 100,
        },
      ],
    },
  ],
};

export const DATASET_3 = {
  nodes: [
    {
      id: 1,
      type: "parent",
      data: {
        name: "workload",
      },
    },
    {
      id: 2,
      type: "child",
      data: {
        name: "pod",
        children: [
          {
            name: "pod1",
            type: "pod"
          },
          {
            name: "pod2",
            type: "pod"
          },
          {
            name: "pod3",
            type: "pod"
          },
        ],
      },
      edges: [
        { source: "pod1", target: "pod3" },
        { source: "pod1", target: "pod2" },
      ],
    },
    {
      id: 3,
      type: "child",
      data: {
        name: "IP",
        children: [
          {
            name: "IP-1",
            type: "IP"
          },
          {
            name: "IP-2",
            type: "IP"
          },
          {
            name: "IP-3",
            type: "IP"
          },
          {
            name: "IP-4",
            type: "IP"
          },
          {
            name: "IP-5",
            type: "IP"
          },
          {
            name: "IP-6",
            type: "IP"
          },
        ],
      },
      edges: [
        {
          source: "IP-1",
          target: "IP-2",
        },

        {
          source: "IP-1",
          target: "IP-5",
        },

        {
          source: "IP-1",
          target: "IP-1",
        },
        {
          source: "IP-1",
          target: "IP-1",
        },
        {
          source: "IP-6",
          target: "IP-3",
        },
      ],
    },
    {
      id: 4,
      type: "child",
      data: {
        name: "SVC",
        children: [
          {
            name: "SVC-1",
            type: "SVC"
          },
          {
            name: "SVC-2",
            type: "SVC"
          },
          {
            name: "SVC-3",
            type: "SVC"
          },
        ],
      },
      show: true,
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: 1,
      target: 2,
      show: true,
    },
    {
      id: "e1-3",
      source: 2,
      target: 1,
      show: true,
    },
    {
      id: "e1-2",
      source: 1,
      target: 3,
      show: true,
    },
    {
      id: "e1-2",
      source: 1,
      target: 4,
      show: true,
    },
    {
      id: "e1-2",
      source: 4,
      target: 1,
      show: true,
    },
  ],
};
