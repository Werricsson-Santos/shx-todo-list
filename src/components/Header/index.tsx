import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import logoImage from "../../assets/logo.png";
import { theme } from "../../theme";
import { MaterialCommunityIcons } from '@expo/vector-icons'

type HeaderProps = {
    task: string
    inputRef: React.RefObject<TextInput>
    onChangeText: (task: string) => void
    onPress: () => void
}

export function Header({ task, inputRef, onChangeText, onPress }: HeaderProps) {
    return <View style={styles.headerContainer}>
        <Image source={logoImage}/>
        <View style={styles.form}>
            <TextInput 
                style={[
                    styles.input, 
                    inputRef.current?.isFocused() && task
                    ? styles.inputBorder 
                    : null]
                } 
                placeholder="Adicione uma nova tarefa" 
                placeholderTextColor={theme.colors.base.gray300} 
                value={task}
                ref={inputRef}
                onChangeText={onChangeText}
                onSubmitEditing={onPress}
                returnKeyType="done"
            />
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <MaterialCommunityIcons name="plus-circle-outline" size={22} color={theme.colors.base.gray100}/>
            </TouchableOpacity>
        </View>
    </View>
}