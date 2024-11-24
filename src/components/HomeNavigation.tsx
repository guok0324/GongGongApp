import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation.tsx";
import ScorePage from "./score/ScorePage.tsx";
import {TablePage} from "./timeTable/tablePage.tsx";
import EmptyClassroomPage from "./emptyClassroom/EmptyClassroomPage.tsx";
import {useEffect} from "react";
import {initTable} from "../app/slice/scheduleSlice.ts";
import {initExam} from "../app/slice/agendaSlice.ts";
import {resetCurrentTime, setDate} from "../app/slice/globalSlice.ts";
import {setScoreOverview} from "../app/slice/scoreSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";
import {initInfo} from "../app/slice/infoSlice.ts";
import SpecificationPage from "./info/SpecificationPage.tsx";
import {setTodayEmptyClassroomStatus, setTomorrowEmptyClassroomStatus} from "../app/slice/classroomSlice.ts";
import {useQuery, useRealm} from "@realm/react";
import GongUser from "../dao/object/User.ts";
import Resources, {ResourceMessage} from "../basic/Resources.ts";
import {ResourceCode} from "../utils/enum.ts";
import notifee from "../../node_modules/@notifee/react-native";
import {AndroidImportance} from "@notifee/react-native";

const HomeNavigation = () => {
    const realm = useRealm();
    const user = useQuery<GongUser>('GongUser')[0];

    const dispatch = useAppDispatch();

    const Stack = createNativeStackNavigator();

    const createChannel = async () => {
        await notifee.createChannel({
            id: 'exam-notification',
            name: 'exam-notification',
            importance: AndroidImportance.HIGH
        });
    }

    const fetchAllData = async () => {
        if(user) {
            console.log('fetch data begin.......');
            if(!user.courses) {
                const msg: ResourceMessage = await Resources.getClassData(user.token);
                if(msg.code === ResourceCode.Successful) {
                    dispatch(initTable(msg.data));
                    console.log('writing courses in realm...');
                    realm.write(() => {
                        user.courses = JSON.stringify(msg.data);
                    });
                    console.log('courses is written!')
                }
            } else {
                dispatch(initTable(JSON.parse(user.courses)));
            }

            if(!user.info) {
                const msg: ResourceMessage = await Resources.getInfo(user.token)
                if(msg.code === ResourceCode.Successful) {
                    dispatch(initInfo(msg.data));
                    console.log('writing userInfo in realm...');
                    realm.write(() => {
                        user.info = JSON.stringify(msg.data);
                    })
                    console.log('userInfo is written!')
                }
            } else {
                dispatch(initInfo(JSON.parse(user.info)));
            }

            if(!user.todayClassroom) {
                const msg: ResourceMessage = await Resources.getTodayClassroomStatus(user.token)
                if(msg.code === ResourceCode.Successful) {
                    dispatch(setTodayEmptyClassroomStatus(msg.data));
                    console.log('writing todayClassroom in realm...');
                    realm.write(() => {
                        user.todayClassroom = JSON.stringify(msg.data);
                    })
                    console.log('todayClassroom is written!');
                }
            } else {
                dispatch(setTodayEmptyClassroomStatus(JSON.parse(user.todayClassroom)));
            }

            if(!user.tomorrowClassroom) {
                const msg: ResourceMessage = await Resources.getTomorrowClassroomStatus(user.token)
                if(msg.code === ResourceCode.Successful) {
                    dispatch(setTomorrowEmptyClassroomStatus(msg.data));
                    console.log('writing tomorrowClassroom in realm...');
                    realm.write(() => {
                        user.tomorrowClassroom = JSON.stringify(msg.data);
                    })
                    console.log('tomorrowClassroom is written!');
                }
            } else {
                dispatch(setTomorrowEmptyClassroomStatus(JSON.parse(user.tomorrowClassroom)));
            }

            if(!user.exam) {
                const msg: ResourceMessage = await Resources.getExam(user.token);
                if(msg.code === ResourceCode.Successful) {
                    dispatch(initExam(msg.data))
                    console.log('writing examAgenda in realm...');
                    realm.write(() => {
                        user.exam = JSON.stringify(msg.data);
                    })
                    console.log('examAgenda is written!');
                }
            } else {
                dispatch(initExam(JSON.parse(user.exam)));
            }

            if(!user.scoreOverview) {
                const msg: ResourceMessage = await Resources.getScoreOverview(user.token)
                if(msg.code === ResourceCode.Successful) {
                    dispatch(setScoreOverview(msg.data));
                    console.log('writing scoreOverview in realm...');
                    realm.write(() => {
                        user.scoreOverview = JSON.stringify(msg.data);
                    })
                    console.log('scoreOverview is written!');
                }
            } else {
                dispatch(setScoreOverview(JSON.parse(user.scoreOverview)));
            }

            if(!user.firstDate) {
                const msg: ResourceMessage = await Resources.getFirstDate(user.token)
                if(msg.code === ResourceCode.Successful)  {
                    dispatch(setDate(msg.data));
                    console.log('writing firstDate in realm...');
                    realm.write(() => {
                        user.firstDate = new Date(msg.data.start);
                        user.termID = msg.data.termID;
                    })
                    console.log('firstDate is written!');
                }
            } else {
                dispatch(setDate({
                    start: user.firstDate.toString(),
                    termID: user.termID,
                }));
            }
            console.log('fetch successful!');
        }
    }

    useEffect(() => {
        dispatch(resetCurrentTime());
        createChannel()
            .then(() => {
                fetchAllData();
            })

        // const intervalID = setInterval(() => {
        //     dispatch(resetCurrentTime());
        // }, 8000);
        //
        // return () => {
        //     clearInterval(intervalID);
        // }
    }, []);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name={'TabNavigation'} component={TabNavigation}/>
            <Stack.Screen name={'EmptyClassroomPage'} component={EmptyClassroomPage}/>
            <Stack.Screen name={'ScorePage'} component={ScorePage}/>
            <Stack.Screen name={'TablePage'} component={TablePage}/>
            <Stack.Screen name={'SpecificationPage'} component={SpecificationPage}/>
        </Stack.Navigator>
    )
}

export default HomeNavigation;
