export const voiceChatService = {
  getResidentCallData: async function (data:any): Promise<void> {
    try {
      console.log('resident data recieved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  }
};