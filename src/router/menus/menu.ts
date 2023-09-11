/**
[
 {
    name: "About",    // 菜单展示名称
    path: "/about",   // fullPath
    category: "About",     // 分类 => 可展开的菜单 需要有children
    icon: "dashboard",     // 图表
    title: "标题",         //
    children: [
      {
        name: "About US",
        path: "/about/us"
      },
      {
        name: "About Comp",
        path: "/about/company",
        children: [
          {
            name: "About Comp A",
            path: "/about/company/A1",
            children: [
              {
                name: "About Comp A 1",
                path: "/about/company/A/1"
              }
            ]
          }
        ]
      }
    ]
  },
 {
    name: "Link",
    path: "/link"
  }
];
 */
