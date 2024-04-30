import { useState, useEffect } from "react";
import { decryptData } from "../auth/Crypto";
import { isValidUUID } from "./utilities";
import axiosInstance from "./api";
import { useDispatch, useSelector } from "react-redux";
import { selectLookups, setLookups } from "../Redux/features/lookups/lookupSlice";
export function useFetchLatestLookup(lookupId, isResultObject = false) {
    const dispatch = useDispatch();
    const lookups = useSelector(selectLookups);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tenantId = decryptData(
                    sessionStorage.getItem("tenant_id")
                );
                const paramType = isValidUUID(lookupId)
                    ? "lookup_id"
                    : "prefix";
                const url = `reference-lookup/latest-version/${tenantId}?${paramType}=${encodeURIComponent(
                    lookupId
                )}`;

                const { data } = lookups?.[lookupId]
                    ? { data: lookups?.[lookupId] }
                    : await axiosInstance.get(url);
                if (dispatch) {
                    dispatch(setLookups({ ...lookups, [lookupId]: data }));
                }
                const reqData = {
                    lookup_values:
                        data?.data?.[0]?.properties?.[0]?.lookup_values.map(
                            (valueObject) =>
                                isResultObject ? valueObject : valueObject.value
                        ) ?? [],
                    isDynamic: data?.data?.[0]?.isDynamic,
                };
                setData(reqData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [lookupId, isResultObject]);

    return data;
}

// export function useFetchLatestLookups(lookupIds, isResultObject = false) {
//     const dispatch = useDispatch();
//     const allLookup = useSelector(selectLookups);

//     const [data, setData] = useState({});

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const tenantId = decryptData(
//                     sessionStorage.getItem("tenant_id")
//                 );
//                 const reqData = lookupIds.map(async (lookupId) => {
//                     const paramType = isValidUUID(lookupId)
//                         ? "lookup_id"
//                         : "prefix";
//                     const url = `reference-lookup/latest-version/${tenantId}?${paramType}=${encodeURIComponent(
//                         lookupId
//                     )}`;

//                     const { data } = allLookup?.[lookupId]
//                         ? { data: allLookup?.[lookupId] }
//                         : await axiosInstance.get(url);
//                     if (dispatch) {
//                         dispatch(
//                             setAllLookup({ ...allLookup, [lookupId]: data })
//                         );
//                     }
//                     return {
//                         lookup_values:
//                             data?.data?.[0]?.properties?.[0]?.lookup_values.map(
//                                 (valueObject) =>
//                                     isResultObject
//                                         ? valueObject
//                                         : valueObject.value
//                             ) ?? [],
//                         isDynamic: data?.data?.[0]?.isDynamic,
//                     };
//                 });
//                 setData(reqData);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchData();
//     }, [lookupIds, isResultObject]);

//     return data;
// }
