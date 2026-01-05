import { reactive, onUnmounted } from "vue";
import { io } from "socket.io-client";
import { useStore } from '@/store';

export function useSocket () {
  let store = useStore()
  const userData = (store.state as any).userModule.userData

  const state = reactive({
    connected: false,
  });

  const URL = import.meta.env.VITE_APP_SOCKET_URL
  const protocol = 'ctl_crm'
  const socket = io(`${URL}/${protocol}`)
  console.log(socket)

  socket.on("connect", () => {
    state.connected = true;
    socket.emit('join', {
      userName: userData.nickName,
      companyCode: 'ctl',
      systemCode: 'crm',
      deptId: userData.deptId,
      groupId: userData.groupId,
      employeeId: userData.employeeId,
      employee: userData.employee,
      socketId: socket.id,
      connected_on: new Date(),
    })
  })

  socket.on("disconnect", () => {
    state.connected = false;
  })

  onUnmounted(() => {
    socket.close()
  })

  return { state, socket }
}



