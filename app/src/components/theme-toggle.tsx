import { Monitor, Moon, Sun } from "lucide-react";
import { type UserTheme, useTheme } from "@/hooks/theme-provider";
import { Button } from "./ui/button";

const themes: UserTheme[] = ["light", "dark", "system"];

export function ThemeSelector() {
	const { userTheme, setTheme } = useTheme();
	console.log(userTheme);

	const cycleTheme = () => {
		const currentIndex = themes.findIndex((t) => t === userTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		setTheme(themes[nextIndex]);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={cycleTheme}
			aria-label={"Click to cycle themes"}
		>
			{userTheme === "light" && <Sun className="h-4 w-4" />}
			{userTheme === "dark" && <Moon className="h-4 w-4" />}
			{userTheme === "system" && <Monitor className="h-4 w-4" />}
		</Button>
	);
}
