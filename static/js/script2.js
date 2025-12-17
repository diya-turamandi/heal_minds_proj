
document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");

  const botReply = getBotResponse(userText);
  setTimeout(() => appendMessage(botReply, "bot"), 500);

  input.value = "";
}

function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(message) {
  const msg = message.toLowerCase();

  const triggers = [
    { keywords: ["depressed", "hopeless", "down", "empty", "low", "miserable"], response: "I'm really sorry you're feeling this way. It’s okay to feel down sometimes, but you don’t have to go through this alone. Want to talk more about what’s on your mind?" },
    { keywords: ["numb", "nothing matters", "apathetic", "unmotivated"], response: "I hear you. It’s tough when things feel numb. You matter, and I’m here to listen whenever you're ready to talk." },
    { keywords: ["can't get out of bed", "exhausted", "no energy"], response: "It sounds like you're really drained right now. It’s okay to take things slow. What would make today a little easier for you?" },
    { keywords: ["depressed", "hopeless", "down", "empty", "low", "miserable"], response: "I'm really sorry you're feeling this way. It’s okay to feel down sometimes, but you don’t have to go through this alone. " },
    { keywords: ["numb", "nothing matters", "apathetic", "unmotivated", "i gave up"], response: "I hear you. It’s tough when things feel numb. You matter, and I’m here to listen whenever you're ready to talk." },
    { keywords: ["can't get out of bed", "exhausted", "no energy"], response: "It sounds like you're really drained right now. It’s okay to take things slow. What would make today a little easier for you?" },
    { keywords: ["isolated", "alone", "no one cares"], response: "I’m really sorry you're feeling isolated. Please know you're not alone, and I’m here for you. Would you like to share more about what you’re going through?" },
    { keywords: ["can't cope", "overwhelmed", "too much to handle"], response: "It’s okay to feel overwhelmed, especially when things get heavy. Let’s take a moment to breathe together. How can I support you through this?" },
    { keywords: ["worthless", "not enough", "unimportant"], response: "You are incredibly important, even if it doesn't feel like it right now. You’re not alone in this feeling. what’s making you feel this way." },
    { keywords: ["empty inside", "no purpose", "lost"], response: "Feeling empty can be really painful. Sometimes, finding a small step to take can help. What’s something that could bring even a little light to your day?" },
    { keywords: ["no motivation", "can't move on", "patchup", "stuck"], response: "When you feel stuck, it can be hard to find motivation. Let’s talk about what’s keeping you in that place—together, we can try to find a way forward." },
    { keywords: ["crying", "tears", "emotional pain"], response: "Crying is a natural response to pain. It’s okay to cry and let those emotions out. I’m here with you." },
    { keywords: ["dark thoughts", "suicidal", "ending it all"], response: "I’m really sorry you’re feeling this way, but I’m glad you reached out. It’s so important to talk to someone who can help, whether it’s a friend, family member, or professional. You matter, and help is available." },
    { keywords: ["hopeless", "no way out", "giving up", "lost hope"], response: "It may feel like there's no way out right now, but please know that things can get better. Take it one step at a time, and reach out if you need support. I’m here for you." },
    { keywords: ["unmotivated", "can’t get anything done", "paralyzed"], response: "It’s really tough when you feel stuck and unmotivated. Let’s break it down together. What’s one small thing that might feel a little more manageable today?" },
    { keywords: ["feeling broken", "nothing works", "everything is wrong"], response: "It’s hard when everything feels wrong, and you feel like you’re falling apart. You don’t have to handle it all by yourself. I’m here to listen, and I care about you." },
    { keywords: ["mental health", "depression", "feeling off", "heavy"], response: "Your mental health is just as important as physical health, and it’s okay to acknowledge when you're struggling. I’m here to talk through it if you need." },
    { keywords: ["can't stop thinking", "mind racing", "jumbled", "too many thoughts", "stoped thinking"], response: "It’s exhausting when your mind won’t stop. Want to try some grounding techniques or just talk through what’s on your mind?" },
    { keywords: ["no hope", "feeling trapped", "can't escape"], response: "It sounds like you’re really overwhelmed, and it’s okay to feel trapped sometimes. Take a deep breath, and know that I’m here to help you through this." },
    { keywords: ["crying all the time", "tearing up", "emotionally drained"], response: "Crying can help release some of that emotional weight. I’m here with you, and it’s okay to let it all out when you’re ready." },
    { keywords: ["always tired", "feeling drained", "no energy"], response: "When you're constantly tired, it’s hard to do anything. Let’s take it slow and focus on self-care. Have you been able to rest or do something that calms you?" },
    { keywords: ["sad", "depressed", "down"], response: "I'm really sorry you're feeling this way. Want to talk about it?" },
    { keywords: ["happy", "good", "great", "excited"], response: "That's wonderful! What’s making you feel this way?" },
    { keywords: ["anxious", "nervous", "worried", "scared", "uneasy"], response: "It's okay to feel anxious. Let's try a calming exercise if you'd like." },
    { keywords: ["angry", "mad", "frustrated"], response: "That sounds intense. Do you want to talk about what made you feel that way?" },
    { keywords: ["tired", "exhausted"], response: "Sounds like you’ve been through a lot. Make sure you get some rest." },
    { keywords: ["alone", "lonely", "help", "need someone"], response: "You're not alone. I'm here for you." },
    { keywords: ["love", "crush", "relationship"], response: "Relationships can be complex. Want to share what’s on your mind?" },
    { keywords: ["cry", "emotional"], response: "Crying helps release emotions. It's okay to cry—I'm here with you." },
    { keywords: ["sleep", "insomnia"], response: "Sleep is important. Are you having trouble getting rest?" },
    { keywords: ["future", "what if", "uncertain"], response: "The future can feel scary, but you’re not alone. I’m here to help you sort through it." },
    { keywords: ["failure", "worthless", "hate myself"], response: "You matter more than you know. You're not alone in this feeling." },
    { keywords: ["give up", "no motivation"], response: "It’s okay to feel stuck. Let’s take it one step at a time. What’s one small thing you can do today?" },
    { keywords: ["memories", "miss them", "used to", "wish they were here"], response: "Memories can feel both comforting and painful. Who or what are you thinking about?" },
    { keywords: ["unsafe", "danger", "threat", "paranoid", "worried about safety"], response: "Feeling unsafe is serious. Do you want to talk about what’s making you feel that way?" },
    { keywords: ["no friends", "ignored", "left out", "rejected", "unnoticed"], response: "It can really hurt to feel left out or alone. You’re seen here. Want to share what happened?" },
    { keywords: ["overthinking", "mind won't stop", "spiraling", "can't stop thinking", "too many thoughts"], response: "Overthinking can feel like being trapped in your own head. Want to try grounding yourself with a calming technique?" },
    { keywords: ["jealous", "envy", "compare", "comparison"], response: "It's natural to compare sometimes, but remember, your path is unique. What’s been making you feel this way?" },
    { keywords: ["motivation", "lazy", "can't focus", "procrastinate"], response: "You're not lazy—you might just be tired or overwhelmed. Want to talk about what's blocking your motivation?" },
    { keywords: ["shy", "social anxiety", "awkward", "introvert"], response: "Being quiet or shy doesn’t mean you’re any less valuable. Social situations can be hard—want to talk through it?" },
    { keywords: ["unloved", "not loved", "miss", "heart break","break up","no one cares"], response: "You are deeply worthy of love and connection. I care, and I'm here for you." },
    { keywords: ["stress", "overwhelmed", "pressure", "too much", "burnout"], response: "It sounds like a lot is happening at once. Take a deep breath. What’s the biggest thing weighing on you right now?" },
    { keywords: ["guilty", "ashamed", "regret"], response: "We all make mistakes. It’s okay to feel guilty, but it's important to forgive yourself. Want to talk about it?" },
    { keywords: ["happy", "excited", "celebration"], response: "That’s amazing! What are you celebrating today?" },
    { keywords: ["fear", "scared", "terrified", "panic","kill"], response: "Fear is powerful, but you’re stronger. Want to talk through what’s scaring you?" },
    { keywords: ["grateful", "thankful", "appreciate"], response: "Gratitude can be really uplifting. What are you feeling thankful for right now?" },
    { keywords: ["hope", "future", "bright", "optimistic"], response: "It’s great to have hope. What are you looking forward to?" },
    { keywords: ["bored", "uninterested", "dull"], response: "Boredom can be tough. Have you thought about picking up something new or interesting to try?" },
    { keywords: ["confused", "unsure", "don't know"], response: "It’s okay to feel uncertain. What’s on your mind that’s making you feel confused?" },
    { keywords: ["grief", "loss", "mourning"], response: "Losing someone is painful. I’m here for you if you want to share your feelings or memories." },
    { keywords: ["hopeful", "positive", "bright future"], response: "That’s wonderful to hear! What are you feeling hopeful about today?" },
    { keywords: ["rejection", "abandoned", "left out"], response: "Feeling rejected can hurt. I’m here to listen, and you’re not alone in this." },
    { keywords: ["jealousy", "envy", "compare myself"], response: "Comparing yourself to others can be difficult. Your journey is unique, and it’s okay to take your time." },
    { keywords: ["overwhelmed", "can't handle", "too much", "too busy"], response: "It’s okay to feel overwhelmed sometimes. Let's break things down together. What's the biggest stress for you right now?" },
    { keywords: ["trust", "betrayed", "hurt by someone"], response: "Trusting people can be tough, especially if you’ve been hurt. Want to talk about what happened?" },
    { keywords: ["change", "new", "different"], response: "Change can be scary, but it also brings new opportunities. How do you feel about what’s changing in your life?" },
    { keywords: ["addiction", "substance", "habit", "obsession"], response: "If you're struggling with a habit or addiction, I’m here to listen and support you. Do you want to talk about it?" },
    { keywords: ["dreams", "goals", "ambition"], response: "Dreams are powerful! What are your goals, and how can I help you get closer to them?" },
    { keywords: ["memory", "nostalgia", "past"], response: "The past can be a source of comfort or sadness. Is there something from your past that’s on your mind?" },
    { keywords: ["self-esteem", "self-worth", "confidence"], response: "You are worthy just as you are. What makes you feel good about yourself?" },
    { keywords: ["insight", "wisdom", "realization"], response: "Moments of insight can be powerful. What have you recently realized about yourself or the world?" },
    { keywords: ["grief", "heartache", "done", "mourning"], response: "Grief can be a heavy load to carry. I’m here to help you through it, and you don’t have to carry it alone." },
    { keywords: ["creativity", "ideas", "inspired"], response: "Creativity can be a wonderful outlet. Have you been feeling inspired lately? What are you working on?" },
    { keywords: ["overcoming", "strength", "resilience"], response: "You’ve overcome challenges before, and you can do it again. What's helping you stay strong right now?" },
    { keywords: ["apologize", "forgiveness", "repairing"], response: "Apologizing can be tough, but it’s a step toward healing. What would you like to make amends for?" },
    { keywords: ["what can u do for me", "how can u help me", "what will u do", "how will u be there with me", "im alone in this", "its so messed up", "can u help me in this?", "please", "please help"], response: "im here to liten u up ,talk to me" },
  ];

  for (const trigger of triggers) {
    for (const keyword of trigger.keywords) {
      if (msg.includes(keyword)) {
        return trigger.response;
      }
    }
  }

  return "I'm listening. Want to share more?";
}




