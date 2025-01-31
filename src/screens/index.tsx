    import { View, Text, FlatList, Alert, TextInput, TouchableOpacity } from "react-native";
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
        const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all')
        const newTaskInputRef = useRef<TextInput>(null)
        const STORAGE_KEY = "@tasks"
        const API_URL = "https://jsonplaceholder.typicode.com/todos";

        useEffect(() => {
            const loadTasks = async () => {
                try {
                    const storedTasks = await AsyncStorage.getItem(STORAGE_KEY)
                    if (storedTasks && JSON.parse(storedTasks).length > 0) {
                        setTasks(JSON.parse(storedTasks))
                    } else {
                        const response = await fetch(API_URL)
                        const data = await response.json()

                        const formatedTasks: TaskDTO[] = data.slice(0, 10).map((task: any) => ({
                            id: String(task.id),
                            title: task.title,
                            isCompleted: task.completed
                        }))

                        setTasks(formatedTasks)
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formatedTasks))
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
                const taskExists = tasks.some(task => task.title.toLowerCase() === newTask.trim().toLowerCase())

                if(taskExists) {
                    Alert.alert("Tarefa já existe", "Uma tarefa com este nome já foi criada.",[
                        {
                            text: 'Ok',
                            style: 'default',
                            onPress: () => setNewTask('')
                        }
                    ])
                    return
                }

                const updatedTasks = [
                    { id: uuid(), isCompleted: false, title: newTask.trim() },
                    ...tasks
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

        const filteredTasks = tasks.filter((task) => {
            if(filter === 'todo') {
                return !task.isCompleted
            } else if(filter === 'completed') {
                return task.isCompleted
            } else {
                return true
            }
        })

        const totalTasksCreated = tasks.length
        const totalTasksCompleted = tasks.filter(({isCompleted}) => isCompleted).length
        const totalTasksToDo = tasks.filter(({isCompleted}) => !isCompleted).length

        return <View style={styles.container}>
            <Header 
                inputRef={newTaskInputRef}
                task={newTask} 
                onChangeText={setNewTask} 
                onPress={handleTaskAdd} 
            />
            <View style={styles.tasksContainer}>
                <View style={styles.info}>
                    <TouchableOpacity 
                        style={[styles.row, filter === 'all' && styles.activeRow]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={styles.tasksCreated}>Criadas</Text>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>
                                {totalTasksCreated}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.row, filter === 'todo' && styles.activeRow]}
                        onPress={() => setFilter('todo')}
                    >
                        <Text style={styles.tasksToDo}>Pendentes</Text>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>
                                {totalTasksToDo}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.row, filter === 'completed' && styles.activeRow]}
                        onPress={() => setFilter('completed')}
                    >
                        <Text style={styles.tasksDone}>Concluídas</Text>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>
                                {totalTasksCompleted}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredTasks}
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