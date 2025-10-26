import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$region/$username/mastery")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$region/$username/mastery"!</div>;
}
