import { View, Text, FlatList, Alert, TextInput } from "react-native";
import { styles } from "./styles";
import { Header } from "../components/Header";
import { Task } from "../components/Task";
import { useState, useEffect, useRef } from "react";
import { TaskDTO } from "../dtos/taskDTO";
import { Empty } from "../components/Empty";
import { uuid } from "../components/utils/uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function HomeScreen() {
    const [tasks, setTasks] = useState<TaskDTO[]>([])
    const [newTask, setNewTask] = useState('')
    const newTaskInputRef = useRef<TextInput>(null)
    const STORAGE_KEY = "@tasks"

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem(STORAGE_KEY)
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks))
                }
            } catch (error) {
                console.error("Erro ao carregar as tarefas:", error)
            }
        }

        loadTasks()
    }, [])

    useEffect(() => {
        const saveTasks = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
            } catch (error) {
                console.error("Erro ao salvar task", error)
            }
        }

        if(tasks.length > 0) {
            saveTasks()
        }

    }, [tasks])

    function handleTaskAdd() {
        if(newTask !== '' && newTask.length > 5) {
            const updatedTasks = [
                ...tasks,
                { id: uuid(), isCompleted: false, title: newTask.trim() },
            ]
            setTasks(updatedTasks)
            setNewTask('')

            newTaskInputRef.current?.blur()
        }
    }

    function handleTaskDone(id: string) {
        setTasks((tasks) => 
            tasks.map((task) => {
                task.id === id ? (task.isCompleted = !task.isCompleted) : null
                return task
            }),
        )
    }

    function handleTaskDeleted(id: string) {
        Alert.alert('Excluir tarefa', 'Deseja excluir essa tarefa?', [
            {
                text: 'Sim',
                style: 'default',
                onPress: () => {
                    const updatedTasks = tasks.filter((task) => task.id !== id)
                    setTasks(updatedTasks)
                    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
                }
            },
            {
                text: 'Não',
                style: 'cancel'
            }
        ])
    }

    const totalTasksCreated = tasks.length
    const totalTasksCompleted = tasks.filter(({isCompleted}) => isCompleted).length

    return <View style={styles.container}>
        <Header 
            inputRef={newTaskInputRef}
            task={newTask} 
            onChangeText={setNewTask} 
            onPress={handleTaskAdd} 
        />
        <View style={styles.tasksContainer}>
            <View style={styles.info}>
                <View style={styles.row}>
                    <Text style={styles.tasksCreated}>Criadas</Text>
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {totalTasksCreated}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.tasksDone}>Concluídas</Text>
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {totalTasksCompleted}
                        </Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(tasks) => tasks.id}
                renderItem={({item}) => (
                    <Task 
                        key={item.id} 
                        onTaskDone={() => handleTaskDone(item.id)}
                        onTaskDeleted={() => handleTaskDeleted(item.id)}
                        {...item}
                    />
                )}
                ListEmptyComponent={<Empty />}
            />

        </View>
    </View>
}