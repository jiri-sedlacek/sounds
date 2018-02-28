from os import listdir
from os.path import isfile, isdir, join
import json
mypath="data"
data={}
for x in filter(lambda x: isdir(join(mypath, x)), listdir(mypath)):
    for y in [f for f in listdir(join(mypath,x)) if isfile(join(mypath,x, f))]:
        path = join(mypath,x,y)
        name = path.split("/")[-1].split(".")[0]
        print(path)
        data[name]=path
#print(data)
toSave = "let x = "
data = json.dumps(data)
f = open("data.js","w")
f.write(toSave + str(data))
f.close()
#with open('data.js', 'w') as fp:
#    json.dump(data, fp)
