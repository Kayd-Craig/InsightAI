import React from 'react';import React from 'react';import React from 'react';import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import GeminiChat from '../../../../src/app/components/OpenAiChat';

import userEvent from '@testing-library/user-event';import { render, screen, waitFor } from '@testing-library/react';import { render, screen, waitFor } from '@testing-library/react';

// Mock generateContentStream before importing

const mockGenerateContentStream = jest.fn();import GeminiChat from '../../../../src/app/components/OpenAiChat';



jest.mock('../../../../src/lib/gemini-api', () => ({import { generateContentStream } from '../../../../src/lib/gemini-api';import userEvent from '@testing-library/user-event';import userEvent from '@testing-library/user-ev  it('prevents submission when already generating', async () => {

  generateContentStream: mockGenerateContentStream,

}));



describe('GeminiChat', () => {// Mock the generateContentStream functionimport { GeminiChatComponent } from '../../../../src/app/components/GeminiChat';    const user = userEvent.setup();

  beforeEach(() => {

    jest.clearAllMocks();const mockGenerateContentStream = jest.fn();

    mockGenerateContentStream.mockResolvedValue({

      response: {    const { geminiApi } = require('../../../../src/lib/gemini-api');

        text: jest.fn().mockResolvedValue('Mocked AI response'),

      },jest.mock('../../../../src/lib/gemini-api', () => ({

    });

  });  generateContentStream: mockGenerateContentStream,// Mock all dependencies    



  it('renders chat interface', () => {}));

    render(<GeminiChat />);

    jest.mock('../../../../src/lib/gemini-api', () => ({    geminiApi.generateContentStream.mockImplementation(async function* () {

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();describe('GeminiChat', () => {

  });

  beforeEach(() => {  geminiApi: {      yield { text: 'First call', error: null, isComplete: true };

  it('displays initial welcome message', () => {

    render(<GeminiChat />);    jest.clearAllMocks();

    

    expect(screen.getByText(/hello! i'm your ai assistant/i)).toBeInTheDocument();    mockGenerateContentStream.mockResolvedValue({    generateContentStream: jest.fn(),    });import { GeminiChatComponent } from '../../../../src/app/components/GeminiChat';

  });

      response: {

  it('allows typing in the input field', async () => {

    const user = userEvent.setup();        text: jest.fn().mockResolvedValue('Mocked AI response'),  },

    render(<GeminiChat />);

          },

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Hello AI');    });}));// Mock all dependencies

    

    expect(input).toHaveValue('Hello AI');  });

  });

jest.mock('../../../../src/lib/gemini-api', () => ({

  it('sends message when send button is clicked', async () => {

    const user = userEvent.setup();  it('renders chat interface', () => {

    render(<GeminiChat />);

        render(<GeminiChat />);jest.mock('../../../../src/lib/userStats', () => ({  geminiApi: {

    const input = screen.getByPlaceholderText('Type your message...');

    const sendButton = screen.getByRole('button', { name: /send/i });    

    

    await user.type(input, 'Test message');    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();  UserSocialAnalytics: jest.fn().mockImplementation(() => ({    generateContentStream: jest.fn(),

    await user.click(sendButton);

        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();

    expect(mockGenerateContentStream).toHaveBeenCalledWith('Test message');

  });  });    set: jest.fn(),  },



  it('sends message when Enter key is pressed', async () => {

    const user = userEvent.setup();

    render(<GeminiChat />);  it('displays initial welcome message', () => {    buildAPIMessage: jest.fn().mockReturnValue('Test message with analytics'),}));

    

    const input = screen.getByPlaceholderText('Type your message...');    render(<GeminiChat />);

    

    await user.type(input, 'Test message{enter}');      })),

    

    expect(mockGenerateContentStream).toHaveBeenCalledWith('Test message');    expect(screen.getByText(/hello! i'm your ai assistant/i)).toBeInTheDocument();

  });

  });}));jest.mock('../../../../src/lib/userStats', () => ({

  it('clears input after sending message', async () => {

    const user = userEvent.setup();

    render(<GeminiChat />);

      it('allows typing in the input field', async () => {  UserSocialAnalytics: jest.fn().mockImplementation(() => ({

    const input = screen.getByPlaceholderText('Type your message...');

    const sendButton = screen.getByRole('button', { name: /send/i });    const user = userEvent.setup();

    

    await user.type(input, 'Test message');    render(<GeminiChat />);jest.mock('../../../../src/components/ui/chat', () => ({    set: jest.fn(),

    await user.click(sendButton);

        

    await waitFor(() => {

      expect(input).toHaveValue('');    const input = screen.getByPlaceholderText('Type your message...');  Chat: ({     buildAPIMessage: jest.fn().mockReturnValue('Test message with analytics'),

    });

  });    await user.type(input, 'Hello AI');



  it('displays user message in chat', async () => {        messages,   })),

    const user = userEvent.setup();

    render(<GeminiChat />);    expect(input).toHaveValue('Hello AI');

    

    const input = screen.getByPlaceholderText('Type your message...');  });    input, }));

    const sendButton = screen.getByRole('button', { name: /send/i });

    

    await user.type(input, 'User test message');

    await user.click(sendButton);  it('sends message when send button is clicked', async () => {    handleInputChange, 

    

    await waitFor(() => {    const user = userEvent.setup();

      expect(screen.getByText('User test message')).toBeInTheDocument();

    });    render(<GeminiChat />);    handleSubmit, jest.mock('../../../../src/components/ui/chat', () => ({

  });

});    

    const input = screen.getByPlaceholderText('Type your message...');    isGenerating,  Chat: ({ 

    const sendButton = screen.getByRole('button', { name: /send/i });

        suggestions    messages, 

    await user.type(input, 'Test message');

    await user.click(sendButton);  }: any) => (    input, 

    

    expect(mockGenerateContentStream).toHaveBeenCalledWith('Test message');    <div data-testid="chat">    handleInputChange, 

  });

      <div data-testid="messages">    handleSubmit, 

  it('sends message when Enter key is pressed', async () => {

    const user = userEvent.setup();        {messages.map((msg: any, idx: number) => (    isGenerating, 

    render(<GeminiChat />);

              <div key={idx} data-testid={`message-${msg.role}`}>    stop, 

    const input = screen.getByPlaceholderText('Type your message...');

                {msg.content}    append, 

    await user.type(input, 'Test message{enter}');

              </div>    suggestions 

    expect(mockGenerateContentStream).toHaveBeenCalledWith('Test message');

  });        ))}  }: any) => (



  it('clears input after sending message', async () => {      </div>    <div data-testid="chat">

    const user = userEvent.setup();

    render(<GeminiChat />);      <textarea      <div data-testid="messages">

    

    const input = screen.getByPlaceholderText('Type your message...');        data-testid="chat-input"        {messages.map((msg: any) => (

    const sendButton = screen.getByRole('button', { name: /send/i });

            value={input}          <div key={msg.id} data-testid={`message-${msg.role}`}>

    await user.type(input, 'Test message');

    await user.click(sendButton);        onChange={handleInputChange}            {msg.content}

    

    await waitFor(() => {        placeholder="Type your message..."          </div>

      expect(input).toHaveValue('');

    });      />        ))}

  });

      <button       </div>

  it('displays user message in chat', async () => {

    const user = userEvent.setup();        data-testid="submit-button"      <textarea

    render(<GeminiChat />);

            onClick={handleSubmit}        data-testid="chat-input"

    const input = screen.getByPlaceholderText('Type your message...');

    const sendButton = screen.getByRole('button', { name: /send/i });      >        value={input}

    

    await user.type(input, 'User test message');        Send        onChange={handleInputChange}

    await user.click(sendButton);

          </button>        placeholder="Type your message..."

    await waitFor(() => {

      expect(screen.getByText('User test message')).toBeInTheDocument();      <button       />

    });

  });        data-testid="stop-button"      <button 



  it('displays AI response in chat', async () => {        disabled={!isGenerating}        data-testid="submit-button"

    const user = userEvent.setup();

    render(<GeminiChat />);      >        onClick={(e) => {

    

    const input = screen.getByPlaceholderText('Type your message...');        Stop          e.preventDefault();

    const sendButton = screen.getByRole('button', { name: /send/i });

          </button>          handleSubmit(e);

    await user.type(input, 'Test question');

    await user.click(sendButton);      <div data-testid="suggestions">        }}

    

    await waitFor(() => {        {suggestions?.map((suggestion: string, idx: number) => (      >

      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();

    });          <button key={idx} data-testid={`suggestion-${idx}`}>        {isGenerating ? 'Generating...' : 'Send'}

  });

            {suggestion}      </button>

  it('disables send button when input is empty', () => {

    render(<GeminiChat />);          </button>      <button 

    

    const sendButton = screen.getByRole('button', { name: /send/i });        ))}        data-testid="stop-button"

    expect(sendButton).toBeDisabled();

  });      </div>        onClick={stop}



  it('enables send button when input has text', async () => {    </div>        disabled={!isGenerating}

    const user = userEvent.setup();

    render(<GeminiChat />);  ),      >

    

    const input = screen.getByPlaceholderText('Type your message...');}));        Stop

    const sendButton = screen.getByRole('button', { name: /send/i });

          </button>

    await user.type(input, 'Test');

    jest.mock('../../../../src/hooks/use-smooth-typing', () => ({      <div data-testid="suggestions">

    expect(sendButton).not.toBeDisabled();

  });  useSmoothTyping: ({ text }: { text: string }) => ({        {suggestions?.map((suggestion: any, index: number) => (



  it('shows loading state when sending message', async () => {    displayedText: text,          <button 

    const user = userEvent.setup();

    mockGenerateContentStream.mockImplementation(() =>   }),            key={index}

      new Promise(resolve => setTimeout(() => resolve({

        response: { text: () => Promise.resolve('Response') }}));            data-testid={`suggestion-${index}`}

      }), 100))

    );            onClick={() => append({ role: 'user', content: suggestion })}

    

    render(<GeminiChat />);// Mock store with proper implementation          >

    

    const input = screen.getByPlaceholderText('Type your message...');const mockStore = {            {suggestion}

    const sendButton = screen.getByRole('button', { name: /send/i });

      activeTab: 'instagram',          </button>

    await user.type(input, 'Test message');

    await user.click(sendButton);  data: {        ))}

    

    // Check for loading state (this might be a spinner or disabled state)    instagram: [1000, 500, 50, 2000, 300, 100, 5000, 8000, 3000, 0, 150, 1200, 800],      </div>

    expect(sendButton).toBeDisabled();

  });    twitter: [2000, 800, 100, 1500, 200, 400, 0, 10000, 4000, 0, 400, 50, 75],    </div>



  it('handles API errors gracefully', async () => {  },  ),

    const user = userEvent.setup();

    mockGenerateContentStream.mockRejectedValue(new Error('API Error'));};}));

    

    render(<GeminiChat />);

    

    const input = screen.getByPlaceholderText('Type your message...');describe('GeminiChatComponent', () => {describe('GeminiChatComponent', () => {

    const sendButton = screen.getByRole('button', { name: /send/i });

      beforeEach(() => {  beforeEach(() => {

    await user.type(input, 'Test message');

    await user.click(sendButton);    jest.clearAllMocks();    jest.clearAllMocks();

    

    await waitFor(() => {  });  });

      // Should display error message or handle error gracefully

      expect(screen.getByText(/error/i) || screen.getByText(/sorry/i)).toBeInTheDocument();

    });

  });  it('renders chat interface', () => {  it('renders chat interface', () => {



  it('maintains chat history', async () => {    render(<GeminiChatComponent />);    render(<GeminiChatComponent />);

    const user = userEvent.setup();

    render(<GeminiChat />);        

    

    const input = screen.getByPlaceholderText('Type your message...');    expect(screen.getByTestId('chat')).toBeInTheDocument();    expect(screen.getByTestId('chat')).toBeInTheDocument();

    const sendButton = screen.getByRole('button', { name: /send/i });

        expect(screen.getByTestId('messages')).toBeInTheDocument();    expect(screen.getByTestId('chat-input')).toBeInTheDocument();

    // Send first message

    await user.type(input, 'First message');    expect(screen.getByTestId('chat-input')).toBeInTheDocument();    expect(screen.getByTestId('submit-button')).toBeInTheDocument();

    await user.click(sendButton);

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();    expect(screen.getByTestId('stop-button')).toBeInTheDocument();

    await waitFor(() => {

      expect(screen.getByText('First message')).toBeInTheDocument();  });  });

    });

    

    // Send second message

    await user.type(input, 'Second message');  it('renders suggestions', () => {  it('renders suggestions', () => {

    await user.click(sendButton);

        render(<GeminiChatComponent />);    render(<GeminiChatComponent />);

    await waitFor(() => {

      expect(screen.getByText('First message')).toBeInTheDocument();        

      expect(screen.getByText('Second message')).toBeInTheDocument();

    });    expect(screen.getByTestId('suggestions')).toBeInTheDocument();    const suggestions = screen.getByTestId('suggestions');

  });

    expect(screen.getByTestId('suggestion-0')).toBeInTheDocument();    expect(suggestions).toBeInTheDocument();

  it('focuses input field on mount', () => {

    render(<GeminiChat />);    expect(screen.getByTestId('suggestion-1')).toBeInTheDocument();    

    

    const input = screen.getByPlaceholderText('Type your message...');    expect(screen.getByTestId('suggestion-2')).toBeInTheDocument();    expect(screen.getByTestId('suggestion-0')).toBeInTheDocument();

    expect(input).toHaveFocus();

  });  });    expect(screen.getByTestId('suggestion-1')).toBeInTheDocument();



  it('has proper accessibility attributes', () => {    expect(screen.getByTestId('suggestion-2')).toBeInTheDocument();

    render(<GeminiChat />);

      it('handles input change', async () => {  });

    const input = screen.getByPlaceholderText('Type your message...');

    const sendButton = screen.getByRole('button', { name: /send/i });    const user = userEvent.setup();

    

    expect(input).toHaveAttribute('aria-label');    render(<GeminiChatComponent />);  it('handles input change', async () => {

    expect(sendButton).toHaveAttribute('aria-label');

  });        const user = userEvent.setup();

});
    const input = screen.getByTestId('chat-input');    render(<GeminiChatComponent />);

        

    await user.type(input, 'Test message');    const input = screen.getByTestId('chat-input');

    expect(input).toHaveValue('Test message');    await user.type(input, 'Test message');

  });    

    expect(input).toHaveValue('Test message');

  it('submits message and calls gemini API', async () => {  });

    const user = userEvent.setup();

    const { geminiApi } = require('../../../../src/lib/gemini-api');  it('submits message and calls gemini API', async () => {

        const user = userEvent.setup();

    geminiApi.generateContentStream.mockImplementation(async function* () {    const { geminiApi } = require('../../../../src/lib/gemini-api');

      yield { text: 'Response', error: null, isComplete: true };    

    });    geminiApi.generateContentStream.mockImplementation(async function* () {

      yield { text: 'Response', error: null, isComplete: true };

    render(<GeminiChatComponent />);    });

    

    const input = screen.getByTestId('chat-input');    render(<GeminiChatComponent />);

    const submitButton = screen.getByTestId('submit-button');    

        const input = screen.getByTestId('chat-input');

    await user.type(input, 'Test message');    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);    

        await user.type(input, 'Test message');

    expect(geminiApi.generateContentStream).toHaveBeenCalled();    await user.click(submitButton);

  });    

    expect(geminiApi.generateContentStream).toHaveBeenCalled();

  it('prevents submission when input is empty', async () => {  });

    const user = userEvent.setup();

    const { geminiApi } = require('../../../../src/lib/gemini-api');  it('prevents submission when input is empty', async () => {

        const user = userEvent.setup();

    render(<GeminiChatComponent />);    render(<GeminiChatComponent />);

        

    const submitButton = screen.getByTestId('submit-button');    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);    await user.click(submitButton);

        

    expect(geminiApi.generateContentStream).not.toHaveBeenCalled();    const { geminiApi } = require('../../../../src/lib/gemini-api');

  });    expect(geminiApi.generateContentStream).not.toHaveBeenCalled();

  });

  it('prevents submission when already generating', async () => {

    const user = userEvent.setup();  it('prevents submission when already generating', async () => {

    const { geminiApi } = require('../../../../src/lib/gemini-api');    const user = userEvent.setup();

        

    geminiApi.generateContentStream.mockImplementation(async function* () {    mockGeminiApi.generateContentStream.mockImplementation(async function* () {

      yield { text: 'First call', error: null, isComplete: true };      yield { text: 'Slow response', error: null, isComplete: true };

    });    });



    render(<GeminiChatComponent />);    render(<GeminiChatComponent />);

        

    const input = screen.getByTestId('chat-input');    const input = screen.getByTestId('chat-input');

    const submitButton = screen.getByTestId('submit-button');    const submitButton = screen.getByTestId('submit-button');

        

    await user.type(input, 'First message');    await user.type(input, 'Test message');

    await user.click(submitButton);    await user.click(submitButton);

        

    // Try to submit again immediately    // Try to click again immediately

    await user.clear(input);    await user.click(submitButton);

    await user.type(input, 'Second message');    

    await user.click(submitButton);    // Should only be called once

        expect(geminiApi.generateContentStream).toHaveBeenCalledTimes(1);

    // Should only be called once  });

    expect(geminiApi.generateContentStream).toHaveBeenCalledTimes(1);

  });  it('displays error when API call fails', async () => {

    const user = userEvent.setup();

  it('displays error when API call fails', async () => {    

    const user = userEvent.setup();        const { geminiApi } = require('../../../../src/lib/gemini-api');

    const { geminiApi } = require('../../../../src/lib/gemini-api');    geminiApi.generateContentStream.mockImplementation(async function* () {

          yield { text: '', error: 'API Error: Test error', isComplete: true };

    geminiApi.generateContentStream.mockImplementation(async function* () {    });

      yield { text: '', error: 'Cannot read properties of undefined (reading \'Symbol(Symbol.asyncIterator)\')', isComplete: true };

    });    render(<GeminiChatComponent />);

    

    render(<GeminiChatComponent />);    const input = screen.getByTestId('chat-input');

        const submitButton = screen.getByTestId('submit-button');

    const input = screen.getByTestId('chat-input');    

    const submitButton = screen.getByTestId('submit-button');    await user.type(input, 'Test message');

        await user.click(submitButton);

    await user.type(input, 'Test message');    

    await user.click(submitButton);    await waitFor(() => {

          expect(screen.getByText(/API Error/)).toBeInTheDocument();

    await waitFor(() => {    });

      expect(screen.getByText(/Cannot read properties of undefined/)).toBeInTheDocument();  });

    });

  });  it('clears input after successful submission', async () => {

    const user = userEvent.setup();

  it('clears input after successful submission', async () => {    

    const user = userEvent.setup();    mockGeminiApi.generateContentStream.mockImplementation(async function* () {

    const { geminiApi } = require('../../../../src/lib/gemini-api');      yield { text: 'Response', error: null, isComplete: true };

        });

    geminiApi.generateContentStream.mockImplementation(async function* () {

      yield { text: 'Response', error: null, isComplete: true };    render(<GeminiChatComponent />);

    });    

    const input = screen.getByTestId('chat-input');

    render(<GeminiChatComponent />);    const submitButton = screen.getByTestId('submit-button');

        

    const input = screen.getByTestId('chat-input');    await user.type(input, 'Test message');

    const submitButton = screen.getByTestId('submit-button');    await user.click(submitButton);

        

    await user.type(input, 'Test message');    await waitFor(() => {

    await user.click(submitButton);      expect(input).toHaveValue('');

        });

    await waitFor(() => {  });

      expect(input).toHaveValue('');

    });  it('initializes UserSocialAnalytics with correct data', () => {

  });    const { UserSocialAnalytics } = require('../../../../src/lib/userStats');

    

  it('initializes UserSocialAnalytics with correct data', () => {    render(<GeminiChatComponent />);

    const { UserSocialAnalytics } = require('../../../../src/lib/userStats');    

        expect(UserSocialAnalytics).toHaveBeenCalled();

    render(<GeminiChatComponent />);    

        const instance = UserSocialAnalytics.mock.instances[0];

    expect(UserSocialAnalytics).toHaveBeenCalled();    expect(instance.set).toHaveBeenCalledWith(

          'instagram',

    const instance = UserSocialAnalytics.mock.instances[0];      [1000, 500, 50, 2000, 300, 100, 5000, 8000, 3000, 0, 150, 1200, 800]

    expect(instance.set).toHaveBeenCalledWith(    );

      'instagram',  });

      [1000, 500, 50, 2000, 300, 100, 5000, 8000, 3000, 0, 150, 1200, 800]

    );  it('builds API message using analytics', async () => {

  });    const user = userEvent.setup();

    const { UserSocialAnalytics } = require('../../../../src/lib/userStats');

  it('builds API message using analytics', async () => {    

    const user = userEvent.setup();    mockGeminiApi.generateContentStream.mockImplementation(async function* () {

    const { geminiApi } = require('../../../../src/lib/gemini-api');      yield { text: 'Response', error: null, isComplete: true };

    const { UserSocialAnalytics } = require('../../../../src/lib/userStats');    });

    

    geminiApi.generateContentStream.mockImplementation(async function* () {    render(<GeminiChatComponent />);

      yield { text: 'Response', error: null, isComplete: true };    

    });    const input = screen.getByTestId('chat-input');

    const submitButton = screen.getByTestId('submit-button');

    render(<GeminiChatComponent />);    

        await user.type(input, 'Test message');

    const input = screen.getByTestId('chat-input');    await user.click(submitButton);

    const submitButton = screen.getByTestId('submit-button');    

        const instance = UserSocialAnalytics.mock.instances[0];

    await user.type(input, 'Test message');    expect(instance.buildAPIMessage).toHaveBeenCalledWith('Test message');

    await user.click(submitButton);  });

    });

    const instance = UserSocialAnalytics.mock.instances[0];
    expect(instance.buildAPIMessage).toHaveBeenCalledWith('Test message');
  });
});