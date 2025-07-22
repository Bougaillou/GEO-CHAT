import { GEEAnalysisRequest } from "@/types";
import axios from "axios";

export const fetchGEEData = async (request: GEEAnalysisRequest) => {
    const { data } = await axios.post('/api/gee', { analyseRequest: request })

    if (!data.succes) {
        throw new Error(data.error);
    }
    return data.features;
};
