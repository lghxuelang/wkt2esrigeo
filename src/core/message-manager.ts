export default class MessageManager {

  actions: [];
  actionClassPromises: object;
  private static _instance: MessageManager;

  constructor() {
    this.actions = [];
    this.actionClassPromises = {};
  }

  public static instance(): MessageManager {
    if (!MessageManager._instance) {
      MessageManager._instance = new MessageManager();
      window._messageManager = MessageManager._instance;
    }
    return MessageManager._instance;
  }

  getActions(): [] {
    return this.actions;
  }

  destroyWidgetActions() {}

  publishMessage() {}
}
