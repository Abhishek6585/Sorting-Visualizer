let n = 15;
let arr = [];
let speed = 500;


init();
let audioCtx = null;

function playNote(freq){
    if(audioCtx==null)
        audioCtx = new(AudioContext || webkitAudioContext || window.webkitAudioContext)();
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0 , audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    n = document.getElementById("size").value;
    main.innerHTML = "";
    for(let i = 0 ; i < n ; i++){
        arr[i] = Math.random();
    }
    showbars();
}

function play(){
    const copy = [...arr];
    const Option = document.getElementById("typeOfSort").value;
    let changes = []; 
    if(Option=="Bubble")
        changes = bubbleSort(copy);
    else if(Option=="Merge")
        changes = mergeSort(copy , 0 , copy.length-1);
    else if(Option=="Selection")
        changes = selectionSort(copy);
    else if(Option=="Quick")
        changes = quickSort(copy);

    animate(changes);
}

function animate(changes){
    const speed = document.getElementById("speed").value;
    if(changes.length==0)
        showbars();

    const [i,j] = changes.shift();
    [arr[i],arr[j]] = [arr[j],arr[i]];
    
    playNote(200+arr[i]*500);
    playNote(200+arr[i]*500);

    showbars([i,j]);
    setTimeout(()=>{
        animate(changes);
    },700 - speed);
}

function bubbleSort(arr){
    const changes = [];
    do{
        var swap = false;
        for(let i = 1 ; i < n ; i++){
            if(arr[i-1] > arr[i]){
                swap = true;
                changes.push([i-1,i]);
                [arr[i-1],arr[i]] = [arr[i],arr[i-1]];
            }
        }
    }while(swap);
    return changes;
}

function selectionSort(arr){
    const changes = [];
    do{
        var swap = false;
        for(let i = 0 ; i < n ; i++){
            let minInd = i;
            for(let j = i+1 ; j < n ; j++){
                if(arr[minInd] > arr[j]){
                    swap = true;
                    changes.push([minInd,j]);
                    [arr[minInd],arr[j]] = [arr[j],arr[minInd]];
                }
            }
        }
    }while(swap);
    return changes;
}

function quickSort(arr) {
    const changes = [];
    quickSortHelper(arr, 0, arr.length - 1, changes);
    return changes;
}

function quickSortHelper(arr, left, right, changes) {
    if (left < right) {
        const pivotIndex = partition(arr, left, right, changes);
        quickSortHelper(arr, left, pivotIndex - 1, changes);
        quickSortHelper(arr, pivotIndex + 1, right, changes);
    }
}

function partition(arr, left, right, changes) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {  
            i++;
            if (i !== j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                changes.push([i, j]);
            }
        }
    }

    if (i + 1 !== right) {
        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        changes.push([i + 1, right]);
    }

    return i + 1;
}

function showbars(index){
    main.innerHTML = "";
    for(let i = 0 ; i < n ; i++){
        
        const bar = document.createElement("div");
        bar.style.height = arr[i]*100 + "%";
        bar.classList.add("bar");

        if(index && index.includes(i))
            bar.style.backgroundColor = "darkgreen";

        main.appendChild(bar);
    }
}