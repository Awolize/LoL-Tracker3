import { Link } from "@tanstack/react-router";

import { buttonVariants } from "~/components/ui/button";

import { MainText } from "./MainText";

export const MainTitleLink = () => {
	return (
		<div className="flex h-full w-full max-w-full items-center justify-center gap-4 align-middle">
			{/* The wordmark stays borderless — it only borrows the outline variant's hover. */}
			<Link
				to="/"
				className="hover:bg-accent hover:text-accent-foreground rounded-md px-2 transition-colors"
			>
				<MainText bold="medium" lg={false} />
			</Link>
			<Link to="/challenges" className={buttonVariants({ variant: "outline", size: "sm" })}>
				Challenges
			</Link>
		</div>
	);
};
