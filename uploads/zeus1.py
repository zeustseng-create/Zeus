import random
a=random.randint(1,100)
print("let's play!")
x=1
i=1
y=99
while True:
  b=int(input(str(x)+"~"+str(y)))
  if b<a:
    print("too small")
    x=b
    i+=1
  elif b>a:
    print("too big")
    y=b
    i+=1
  else:
    print("you win")
    break
print("you play"+str(i)+"times")

