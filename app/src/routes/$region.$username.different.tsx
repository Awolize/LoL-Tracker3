import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$region/$username/different")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$region/$username/challenge",
      params: params,
      replace: true,
    });
  },
});