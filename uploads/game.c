#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    char name[50];
        int guess;
	    int answer;

	        srand(time(NULL));
		    answer = rand() % 99 + 1;

		        printf("你叫什麼名字？\n");
			    scanf("%49s", name);

			        printf("Hello %s，終極密碼要開始了喔！\n", name);

				    while (1) {
				            printf("請輸入 1 到 99 的數字：\n");
					            scanf("%d", &guess);

						            if (guess == answer) {
							                printf("You win!\n");
									            break;
										            } else if (guess > answer) {
											                printf("Too big\n");
													        } else {
														            printf("Too small\n");
															            }
																        }

																	    return 0;
																	    }
