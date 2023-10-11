import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'

const ChatMessagesScreen = () => {
  return (
    <KeyboardAvoidingView>
        <ScrollView>
            {/* All the messages go over here */}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ChatMessagesScreen