import { useUIContext } from "../context/UIContext";


export const useUI = useUIContext;
// export function useUI() {
//   const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIContext();

//   return {
//     theme,
//     toggleTheme,
//     sidebarOpen,
//     toggleSidebar,
//   };
// }