module.exports = {
  content: ["./src/*", "./src/**/*"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    darkTheme: "light",
    themes: [
      {
        modern: {
          "primary": "#9be582",
          "secondary": "#6bff3a",
          "accent": "#4b90e5",
          "neutral": "#191523",
          "base-100": "#272C4F",
          "info": "#6ACEE7",
          "success": "#31C994",
          "warning": "#E29003",
          "error": "#F96282",
        },
        hack: {
          "primary": "#12A646",
          "secondary": "#022601",
          "accent": "#22c55e",
          "neutral": "#0D0D0D",
          "base-100": "#022601",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#ca8a04",
          "error": "#D91111",
        },
      },
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"
    ],

  },

}
