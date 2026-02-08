import clsx from "clsx";

interface TogglePillProps {
	label: string;
	checked: boolean;
	onChange: () => void;
	icon?: React.ReactNode;
}

export const TogglePill = ({
	label,
	checked,
	onChange,
	icon,
}: TogglePillProps) => {
	return (
		<button
			type="button"
			onClick={onChange}
			className={clsx(
				"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
				"border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50",
				checked
					? "bg-primary text-primary-foreground border-primary shadow-sm"
					: "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground",
			)}
		>
			{icon && <span className="w-3.5 h-3.5">{icon}</span>}
			{label}
		</button>
	);
};

interface TogglePillGroupProps {
	children: React.ReactNode;
}

export const TogglePillGroup = ({ children }: TogglePillGroupProps) => {
	return (
		<div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-full">
			{children}
		</div>
	);
};
