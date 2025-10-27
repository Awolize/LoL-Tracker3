import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$region/$username/different")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$region/$username/test"!</div>;
}
