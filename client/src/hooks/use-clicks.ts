import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateClickInput } from "@shared/routes";

// GET /api/clicks/today
export function useTodaysClicks() {
  return useQuery({
    queryKey: [api.clicks.listToday.path],
    queryFn: async () => {
      const res = await fetch(api.clicks.listToday.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch today's clicks");
      return api.clicks.listToday.responses[200].parse(await res.json());
    },
    // Refresh often to keep screens in sync if multiple users are clicking
    refetchInterval: 5000, 
  });
}

// POST /api/clicks
export function useCreateClick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateClickInput) => {
      const validated = api.clicks.create.input.parse(data);
      const res = await fetch(api.clicks.create.path, {
        method: api.clicks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.clicks.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to record click");
      }
      return api.clicks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.clicks.listToday.path] });
    },
  });
}
