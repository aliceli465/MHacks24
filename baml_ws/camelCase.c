/**
 * extreme_edge_cases
 * CS 341 - Spring 2024
 */
#include <stdlib.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>


//word to camel 
//if a letter comes after a number and the first char is a number TOO
char * wordToCamel(const char *word, bool isFirst) {
    int len = strlen(word);
    char * camel = malloc(len+1);
    bool firstCharWithDigits = false;
    //first char
    if(isFirst) {
        camel[0] = tolower(word[0]);
    }
    else {
        camel[0] = toupper(word[0]);
    }
    //every othr char should be lower
    for(int i = 1; i < len; ++i) {
        if(isdigit(word[i-1]) && isalpha(word[i])) {
            //have not seen firstcharwithdigits yet
            if(!firstCharWithDigits) {
                camel[i] = toupper(word[i]);
                firstCharWithDigits = true;
            }
            else{
                camel[i] = tolower(word[i]);
            }
        }
        else{
            camel[i] = tolower(word[i]);
        }
    }
    camel[len] = '\0';
    return camel;
}

int num_sentences(const char *input_str) {
    int num_sentences = 0;
    if(input_str == NULL) {
        return 0;
    }
    bool isPrevAlpha = false;
    // "hi..!hi.hi. a NULL" -> should return 3
    for(const char * ptr = input_str; *ptr != '\0'; ++ptr) {
        if(ispunct(*ptr)) {
            if(isPrevAlpha) {
                num_sentences += 1;
            }
            isPrevAlpha = false;
        }
        else if(isalpha(*ptr)) {
            isPrevAlpha = true;
        }
    }
    return num_sentences;
}
int num_punctuation(const char *input_str) {
    int num_punctuation = 0;
    if(input_str == NULL) {
        return 0;
    }
    // Loop through each character in the input string
    for(const char *ptr = input_str; *ptr != '\0'; ++ptr) {
        // Check if the current character is a punctuation mark
        if(ispunct(*ptr)) {
            // Increment the count of punctuation marks
            num_punctuation++;
        }
    }
    return num_punctuation;
}
//num words in a sentence
int num_words(const char *sentence) {
    //"hi there"
    if(sentence == NULL) {
        return 0;
    }
    int num_words = 0;
    bool isPrevAlpha = false;
    bool isPrevDigit = false;
    for(const char * ptr = sentence; *ptr != '\0'; ++ptr) {
        if(isspace(*ptr)) {
            //a word has been found!
            if(isPrevAlpha || isPrevDigit) {
                num_words += 1;
            }
            isPrevAlpha = false;
            isPrevDigit = false;
        }
        else if(isalpha(*ptr)) {
            isPrevAlpha = true;
            isPrevDigit = false;
        }
        else if(isdigit(*ptr)){
            isPrevDigit = true;
            isPrevAlpha = false;
        }
    }
    if(isPrevAlpha || isPrevDigit) {
        num_words += 1;
    }
    return num_words;
}
//TODO!
char ** getSentences(const char *input_str) {
    int num = num_punctuation(input_str);
    //allocate memory for an array of sentences
    char **sentences = (char **)malloc(num * sizeof(char*));
    //iterate through, and keep track of size of each sentence
    int sentence_size = 0;
    int i = 0;
    bool isPrevAlpha = false;
    bool isPrevSpace = false;
    bool isPrevPunct = false;
    bool isPrevDigit = false;
    for(const char * ptr = input_str; *ptr != '\0'; ++ptr) { 
        if(ispunct(*ptr)) {
            //first char is punctuation or prev was punct, so empty
            if(ptr == input_str || isPrevPunct){
                sentences[i] = malloc(1);
                sentences[i][0] = '\0';
                i+=1;
            }
            //we have a non empty sentence
            else if(isPrevAlpha || isPrevSpace || isPrevDigit) {
                //allocate memory for a new sentence
                //TODO!
                sentences[i] = (char*)malloc((sentence_size+1));
                //copy sentence to array
                //TODO!
                strncpy(sentences[i], ptr - sentence_size, sentence_size);
                //null terminate
                sentences[i][sentence_size] = '\0';
                //increase index
                i+=1;
            }
            //reset sentence size
            sentence_size = 0;
            isPrevAlpha = false;
            isPrevSpace = false;
            isPrevPunct = true;
            isPrevDigit = false;
        }
        //add regardless lmao
        else if(isalpha(*ptr)) {
            sentence_size+=1;
            isPrevAlpha = true;
            isPrevSpace = false;
            isPrevPunct = false;
            isPrevDigit = false;
        }
        else if(isspace(*ptr)) {
            sentence_size+=1;
            isPrevAlpha = false;
            isPrevSpace = true;
            isPrevPunct = false;
            isPrevDigit = false;
        }
        else if(isdigit(*ptr)) {
            sentence_size+=1;
            isPrevAlpha = false;
            isPrevSpace = false;
            isPrevPunct = false;
            isPrevDigit = true;
        }
    }
    return sentences;
}

//split sentence string into array of words
char ** getWords(const char *sentence) {
    //white space time
    int num = num_words(sentence);
    if(num == 0) {
        return NULL;
    }
    char **words = (char **)malloc((num+1)*sizeof(char*));
    
    int word_size = 0;
    int i = 0;
    bool isPrevAlpha = false;
    bool isPrevDigit = false;
    const char *lastPtr = sentence;
    //" why hello there"
    for(const char * ptr = sentence; *ptr != '\0'; ++ptr) {
        if(isspace(*ptr)) {
            //word!
            if(isPrevAlpha || isPrevDigit) {
                words[i] = (char*)malloc((word_size+1));
                strncpy(words[i], ptr - word_size, word_size);
                words[i][word_size] = '\0';
                i+=1;
            }
            word_size = 0;
            isPrevAlpha = false;
            isPrevDigit = false;
        }
        else if(isalpha(*ptr) || isdigit(*ptr)) {
            //most recent start of new word
            if(!isPrevAlpha) {
                lastPtr = ptr;
            }
            word_size += 1;
            isPrevAlpha = true;
        }
    }
    if(isPrevAlpha || isPrevDigit) {
        words[i] = (char *)malloc((word_size+1));
        strncpy(words[i], lastPtr, word_size);
        words[i][word_size] = '\0';
        i+=1;
    }
    words[i] = NULL;
    return words;
}

//given sentence, return camelcase version
char * getCamelSentence(const char *str) {
    int numWords = num_words(str);
    char ** words = getWords(str);
    if(words == NULL) {
        char *emptyString = malloc(1);
        emptyString[0] = '\0';
        for (int i = 0; i < numWords; ++i) {
            free(words[i]);
        }
        free(words);
        return emptyString;
    }
    int totalLength = 0;
    int index = 0;
    //find total len of our overall string
    for(int i = 0; i < numWords; ++i) {
        totalLength += strlen(words[i]);
    }
    char *camel_sentence = malloc(totalLength+1);
    char* firstWord = wordToCamel(words[0], 1);
    strcpy(camel_sentence, firstWord);
    free(firstWord);
    index += strlen(words[0]);

    for(int i = 1; i < numWords; ++i) {
        char *camelWord = wordToCamel(words[i], 0);
        strcpy(camel_sentence + index, camelWord);
        free(camelWord);
        index += strlen(words[i]);
    }

    for (int i = 0; i < numWords; ++i) {
        free(words[i]);
    }
    free(words);

    return camel_sentence;
}
//TODO: add removeNumbers
char ** camel_caser(const char *input_str) {
    if(input_str == NULL) {
        return NULL;
    }
    int numSentences = num_punctuation(input_str);
    char **sentences = getSentences(input_str);
    //forgot to do numSentences+1 instead of just numsentences
    char **to_return = (char **)malloc((numSentences+1)*sizeof(char *));
    //free(updated_str);
    for (int i = 0; i < numSentences; ++i) {
        //TODO!
        char * camelSentence = getCamelSentence(sentences[i]);
        if(camelSentence == NULL) {
            to_return[i] = malloc(1);
            to_return[i][0] = '\0';
        }
        else{
            to_return[i] = malloc(strlen(camelSentence)+1);
            strcpy(to_return[i], camelSentence);
            free(camelSentence);
        }
    }
    //null terminator, but char ** version
    to_return[numSentences] = NULL;
    for(int i = 0; i < numSentences; ++i) {
        free(sentences[i]);
        sentences[i] = NULL;
    }
    free(sentences);
    return to_return;
}

void destroy(char **result) {
    // free memory used by camel_caser
    if(result == NULL) {
        return;
    }
    int i = 0;
    while(result[i] != NULL) {
        //TODO!
        free(result[i]);
        result[i] = NULL;
        i+=1;
    }
    free(result);
}

int main(int argc, char *argv[]) {
	camel_caser("hello");
}


