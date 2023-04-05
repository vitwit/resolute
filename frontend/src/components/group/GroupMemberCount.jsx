import { useDispatch, useSelector } from "react-redux";
import * as React from "react";
import { getGroupMembers } from "../../features/group/groupSlice";
import { CircularProgress } from "@mui/material";

function GroupMemberCount(props) {
    const dispatch = useDispatch();
    const [memberCount, setMemberCount] = React.useState(0);

    const wallet = useSelector((state) => state.wallet);
    const members = useSelector(state => state.group.members);

    const { groupId } = props;
    console.log('memberssssssss', groupId, members, wallet?.chainInfo)

    React.useEffect(() => {
        // const { chainInfo } = wallet;

        // const data = {
        //     baseURL: chainInfo?.config?.rest,
        //     groupId
        // }

        // dispatch(getGroupMembers(data))
    }, [])

    return (
        <div>
            {
                members?.status === 'loading' ? <CircularProgress /> :
                    members?.pagination?.total || 0
            }
        </div>
    )
}

export default GroupMemberCount