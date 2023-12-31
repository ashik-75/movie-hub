import { client } from "@/utils/api-client";
import { ApiResponse, Show, ShowDetails } from "@/features/movie/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchTvSeries = (
	endpoint: string | undefined
): Promise<ApiResponse<Show>> => {
	return endpoint === undefined
		? Promise.reject(new Error("Invalid Url"))
		: client(endpoint);
};

const fetchSingleTvSeries = (
	seriesId: string | undefined
): Promise<ShowDetails> => {
	return seriesId === undefined
		? Promise.reject(new Error("Invalid Id"))
		: client(`tv/${seriesId}`);
};

export const useGetTvSeries = (endpoint: string | undefined) => {
	return useInfiniteQuery({
		queryKey: [endpoint],
		queryFn: ({ pageParam }) => fetchTvSeries(`${endpoint}?page=${pageParam}`),
		enabled: Boolean(endpoint),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			return lastPage.total_pages > lastPage.page ? lastPage.page + 1 : null;
		},
	});
};

export const useGetShowDetails = (showId: string | undefined) => {
	return useQuery({
		queryKey: ["tv-series", showId],
		queryFn: () => fetchSingleTvSeries(showId),
		enabled: Boolean(showId),
	});
};
