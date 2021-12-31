import ChatBotMessage from '../api/integration/models/chatbot-message.model';
import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';

class VirtualAssistantInstance {
  private Assistant: AssistantV2;

  constructor() {
    this.Assistant = new AssistantV2({
      version: '2021-06-14',
      authenticator: new IamAuthenticator({
        apikey: 'JIB_U6m6dQE9kCuvI_6UfGzLC3iE1Jhh5b0isBTQM27j'
      }),
      serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/920959c2-7913-48c1-bc86-d4b6d75311e0'
    });
  }

  /**
   * The IBM Watson™ Assistant service combines machine learning, natural language understanding, and an integrated
   * dialog editor to create conversation flows between your apps and your users.
   * The Assistant v2 API provides runtime methods your client application can use to send user input to an assistant
   * and receive a response.
   *
   * @param  {AnimalEnum} animalName: type of animal
   * @returns {Promise<Array<AnimalFeeding>>}: promise to return list of AnimalFeeding
   */
  public async send(message: string, currentContext: Map<string, object>, sessionId: string): Promise<ChatBotMessage> {
    const { result } = await this.Assistant.message({
      assistantId: 'dd4a29ca-2624-4fcd-b63e-da4958a62ee7',
      sessionId,
      context: {
        skills: {
          user_defined: currentContext
        }
      },
      input: {
        message_type: 'text',
        text: message,
        options: {
          return_context: true
        }
      }
    });

    const answers = this.getAnswers(result.output.generic);
    const context = this.converterToMap(result.context?.skills);

    return new ChatBotMessage(answers, context);
  }

  public async createSession(): Promise<string> {
    const response = await this.Assistant.createSession({
      assistantId: 'dd4a29ca-2624-4fcd-b63e-da4958a62ee7'
    });

    return response.result.session_id;
  }

  private converterToMap(context?: AssistantV2.JsonObject): Map<string, object> {
    return context ? new Map(Object.entries(context)) : new Map();
  }

  private getAnswers(answers?: Array<AssistantV2.RuntimeResponseGeneric>): Array<string> {
    return answers?.map((e: any) => e?.text) || [];
  }
}

export default VirtualAssistantInstance;
