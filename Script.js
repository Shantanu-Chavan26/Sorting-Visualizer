const n = 20;
        const array = [];

        init();  // Auto refresh and run the init function
        let audioCtx = null;

        function playnote(freq){
            if(audioCtx == null)
            {
                audioCtx = new(
                    AudioContext || 
                    webkitAudioContext || 
                    window.webkitAudioContext
                ) ();
            } 
            const dur = 0.1;
            const osc = audioCtx.createOscillator();
            osc.frequency.value = freq;
            osc.start();
            osc.stop(audioCtx.currentTime+dur);
            const node = audioCtx.createGain();
            node.gain.value = 0.1;
            node.gain.linearRampToValueAtTime (
                0 , audioCtx.currentTime+dur
            );
            osc.connect(node);
            node.connect(audioCtx.destination);
        }

        function init() {
            // Random array generation
            for (let i = 0; i < n; i++) {
                array[i] = Math.random();
            }
            showBars();
        }

        function play() {
            const copy = [...array]; 
            const moves = bubbleSort(copy);
            animate(moves);
        }

        function animate(moves) {
            if (moves.length === 0) {
                showBars();
                return;
            }

            const move = moves.shift();
            const [i, j] = move.indices;

            if (move.type === "swap") {
                [array[i], array[j]] = [array[j], array[i]];
            }

            playnote(200 + array[i]*500);
            playnote(200 + array[j]*500);

            showBars(move);
            setTimeout(() => {
                animate(moves);
            }, 50);
        }

        function bubbleSort(array) {
            const moves = [];
            let swapped;
            let length = n;
            do {
                swapped = false;
                for (let i = 1; i < length; i++) {
                    moves.push({ indices: [i - 1, i], type: "comp" });
                    if (array[i - 1] > array[i]) {
                        swapped = true;
                        moves.push({ indices: [i - 1, i], type: "swap" });
                        [array[i - 1], array[i]] = [array[i], array[i - 1]];
                    }
                }
                length--;
            } while (swapped);
            return moves;
        }

        function showBars(move) {
            // Generate bars
            const container = document.getElementById("Container");
            container.innerHTML = "";
            for (let i = 0; i < array.length; i++) {
                const bar = document.createElement("div");
                bar.style.height = array[i] * 100 + "%";
                bar.classList.add("bar");

                if (move && move.indices.includes(i)) {
                    bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
                } else {
                    bar.style.backgroundColor = "#4caf50";
                }

                container.appendChild(bar);
            }
        }
