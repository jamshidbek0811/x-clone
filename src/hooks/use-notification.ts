import fetcher from "@/lib/fetcher"
import useSWR from "swr"

const useNotifications = (id: string) => {
    const data = useSWR(`/api/notifications/${id}`, fetcher)
    return data
}

export default useNotifications