import * as React from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import {setNoteModified} from "../redux/actions/NoteAction";

import {Text, TouchableOpacity, View} from "react-native";
import {styled} from "nativewind";

import {setNote} from "../storage/NoteStorage";

import {
    CheckCircleIcon,
    QuestionMarkCircleIcon,
} from "react-native-heroicons/outline";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const NoteItem = (props) => {
    const dispatch = useDispatch();

    const {
        id: itemId,
        navigation,
    } = props;

    const {
        title,
        description,
        isResolved,
        isPinEnabled,
        isNotificationEnabled,
        notificationStart,
        notificationEnd,
        createdTime,
        updatedTime,
    } = props;

    const isExpired = isNotificationEnabled ?
        dayjs().isAfter(dayjs(notificationEnd)) :
        null;

    const collectInputItem = () => ({
        title,
        description,
        isResolved,
        isPinEnabled,
        isNotificationEnabled,
        notificationStart,
        notificationEnd,
        createdTime,
        updatedTime,
    });

    const handlePressCircle = () => {
        const item = collectInputItem();
        item.isResolved = !item.isResolved;
        setNote(item, itemId)
            .then(() => {
                dispatch(setNoteModified(true));
            })
            .catch((e) => {
                console.error(e);
            });
    };

    const handlePressBar = () => {
        const item = collectInputItem();
        navigation.navigate("NoteViewStack", {
            currentItem: {id: itemId, ...item},
        });
    };

    return (
        <StyledView
            className="flex px-5 py-3 hover:bg-gray-100 w-full flex-row"
        >
            <StyledTouchableOpacity
                className="flex-none w-10 mr-3 cursor-pointer"
                onPress={handlePressCircle}
            >
                {
                    isResolved ?
                        (<CheckCircleIcon color="#000" title="已完成" size={35}/>) :
                        (<QuestionMarkCircleIcon color="#000" title="未完成" size={35}/>)
                }
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
                className="grow select-none cursor-pointer"
                onPress={handlePressBar}
            >
                <StyledView>
                    <StyledText className="text-slate-900">
                        {title}
                    </StyledText>
                </StyledView>
                <StyledView className="grow w-full select-none cursor-pointer">
                    <StyledText className="text-gray-600">
                        {
                            isResolved ?
                                "歐耶已經完成了" :
                                isNotificationEnabled ?
                                    (
                                        isExpired ?
                                            `完蛋了！提醒已經過期（${notificationEnd}）` :
                                            `提醒啟動！（${notificationStart}～${notificationEnd}）`
                                    ) :
                                    "要記得完成呦"
                        }
                    </StyledText>
                </StyledView>
            </StyledTouchableOpacity>
        </StyledView>
    );
};

NoteItem.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    isResolved: PropTypes.bool,
    isPinEnabled: PropTypes.bool,
    isNotificationEnabled: PropTypes.bool,
    notificationStart: PropTypes.string,
    notificationEnd: PropTypes.string,
};

export default NoteItem;
