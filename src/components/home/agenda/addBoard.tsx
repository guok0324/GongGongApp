import React, {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {SvgXml} from "react-native-svg";
import XMLResources from "../../../basic/XMLResources.ts";
import {BackgroundColor, FontColor, FontSize} from "../../../config/globalStyleSheetConfig.ts";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {useAppDispatch} from "../../../app/hooks.ts";
import MyTextInput from "./myTextInput.tsx";
import DateTimePickerModal from "react-native-modal-datetime-picker";


/**
 * 呼出倒计时添加
 * @constructor
 */
const AddBoard = ({handleClose}: { handleClose: () => void }) => {
    const dispatch = useAppDispatch();
    const [onlyExam, setOnlyExam] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [dateStr, setDateStr] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [tip, setTip] = useState<string>('');
    const [dateVisibility, setDateVisibility] = useState<boolean>(false);
    const winWidth = useWindowDimensions().width;

    const colorValue = useSharedValue(400);
    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(colorValue.value, [0, 1], [BackgroundColor.invalid, BackgroundColor.primary])
        }
    })

    const beValid = () => {
        colorValue.value = withTiming(1, {
            duration: 300,
            easing: Easing.ease,
        })
    }

    useEffect(() => {
        if (name !== '' && location !== '') {
            beValid();
        }
    }, [name, location]);

    const handleOnlyExam = () => {
        setOnlyExam(!onlyExam);
    }

    const handleName = (data: string) => {
        setName(data);
    }

    const handleLocation = (data: string) => {
        setLocation(data);
    }

    const handleTip = (data: string) => {
        setTip(data);
    }

    const showDatePicker = () => {
        setDateVisibility(true);
    }

    const handleConfirm = (date: any) => {
        const tmp = new Date(date);
        setDateVisibility(false);
    }

    const handleCancel = () => {
        setDateVisibility(false);
    }

    return (
        <View style={[ss.addAgendaContainer, {width: winWidth}]}>
            <View style={{width: '100%', height: 30, display: 'flex', alignItems: 'flex-end'}}>
                <Pressable onPress={handleClose}>
                    <SvgXml xml={XMLResources.closeAddBoard} width="20" height="20"/>
                </Pressable>
            </View>
            <View style={{width: '100%'}}>
                <Text style={ss.inputAgendaText}>事项名称</Text>
                <Pressable onPress={handleOnlyExam}
                           style={{display: 'flex', flexDirection: 'row', position: 'absolute', top: 0, right: 0}}>
                    <SvgXml xml={onlyExam ? XMLResources.exam : XMLResources.notExam} width="16" height="16"/>
                    <Text style={{marginLeft: 5, color: FontColor.grey, lineHeight: 17}}>仅考试</Text>
                </Pressable>
                <MyTextInput placeholder={'如: 英语四级'} sendData={handleName}/>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: 10}}>
                <View style={{width: '40%'}}>
                    <Text style={ss.inputAgendaText}>时间</Text>
                    <Pressable style={ss.dateContainer} onPress={showDatePicker}>
                        <Text>{}</Text>
                    </Pressable>
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={ss.inputAgendaText}>地点</Text>
                    <MyTextInput placeholder={'(选填)'} sendData={handleName}/>
                </View>
            </View>
            <View style={{marginTop: 10, width: '100%'}}>
                <Text style={ss.inputAgendaText}>备注</Text>
                <MyTextInput placeholder={'(选填)如: 四级500分一击必中!!!'} sendData={handleName} multiline={true}
                             height={90} alignCenter={false}/>
            </View>
            <Pressable style={{marginTop: 25}}>
                <Animated.View style={[ss.finishButton, buttonAnimatedStyle]}>
                    <Text style={{
                        fontSize: FontSize.m,
                        color: FontColor.light,
                        textAlign: 'center',
                        height: '100%',
                        lineHeight: 30,
                        fontWeight: '600'
                    }}>完成</Text>
                </Animated.View>
            </Pressable>
            <DateTimePickerModal
                isVisible={dateVisibility}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            ></DateTimePickerModal>
        </View>
    )
}

const ss = StyleSheet.create({
    addAgendaContainer: {
        height: 400,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingTop: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    inputAgendaText: {
        fontSize: FontSize.s,
        color: FontColor.grey,
        letterSpacing: 1,
        marginBottom: 8,
    },

    inputAgenda: {
        height: 34,
        borderRadius: 5,
        fontSize: FontSize.m,
        backgroundColor: '#fff7f8',
        paddingLeft: 5,
        paddingTop: 2,
    },

    finishButton: {
        width: 100,
        height: 32,
        borderRadius: 16,
    },

    dateContainer: {
        width: '100%',
        height: 34,
        backgroundColor: '#ffcad1',
    }
})

export default AddBoard;
