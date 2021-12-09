<script lang="ts">
  import { onMount } from "svelte";
  export let name = "test";

  let mostrarEncuestas: boolean = true;
  let cargandoi: boolean = true;
  let respondiendo: boolean = false;
  let encuestaTerminada: boolean = false;
  let evaluaciones = [];
  let campana: any = {};
  let preguntas = [];
  let evaluador: any = {};
  let servicio = "";
  let iEvaluacion = 0;
  const params = new URLSearchParams(window.location.search);
  const respuestaId = params.get("i");
  onMount(async () => {
    const response = await fetch(`/api/respuestas/${respuestaId}`);
    const respuesta = await response.json();
    console.log("termino", respuesta);
    cargandoi = false;
    evaluaciones = respuesta.evaluaciones;
    campana = respuesta.campana;
    evaluador = respuesta.evaluador;
  });

  function abrirEncuesta(evaluacion, indiceEvaluacion) {
    iEvaluacion = indiceEvaluacion;
    mostrarEncuestas = false;
    servicio = evaluacion.servicio;
    preguntas = evaluacion.preguntas;
  }

  function volver() {
    mostrarEncuestas = true;
  }

  async function puntuar(nota, iPregunta) {
    respondiendo = true;
    const data = { e: iEvaluacion, p: iPregunta, v: nota };
    const response = await fetch(`/api/private/respuestas/${respuestaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    respondiendo = false;

    if (evaluaciones.some((t) => t.preguntas.some((p) => !p.valor))) {
      console.log("-");
    } else {
      respondiendo = true;
      const dataFinaliza = { ev: evaluador.id };
      const respfinaliza = await fetch(`/api/private/campana/${campana.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinaliza),
      });
      encuestaTerminada = true;
      mostrarEncuestas = true;
    }
  }
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="relative pt-6 pb-16 sm:pb-24">
  <div class="pb-5 border-b border-gray-200 text-center">
    <h3 class="text-lg leading-6 font-medium text-gray-900">Encuestas Calidad de Servicio</h3>
  </div>

  {#if cargandoi}
    <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-blue-400 h-12 w-12" />
        <div class="flex-1 space-y-4 py-1">
          <div class="h-4 bg-blue-400 rounded w-3/4" />
          <div class="space-y-2">
            <div class="h-4 bg-blue-400 rounded" />
            <div class="h-4 bg-blue-400 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
    <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto mt-3">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-blue-400 h-12 w-12" />
        <div class="flex-1 space-y-4 py-1">
          <div class="h-4 bg-blue-400 rounded w-3/4" />
          <div class="space-y-2">
            <div class="h-4 bg-blue-400 rounded" />
            <div class="h-4 bg-blue-400 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if mostrarEncuestas}
    <div class="bg-white shadow overflow-hidden sm:rounded-m max-w-7xl mx-auto">
      <ul role="list" class="divide-y divide-gray-200">
        {#each evaluaciones as evaluacion, i}
          <li class="px-4 py-4 sm:px-0 cursor-pointer" on:click={() => abrirEncuesta(evaluacion, i)}>
            <div class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">{evaluacion.servicio}</p>
                  <div class="ml-2 flex-shrink-0 flex">
                    {#if evaluacion.preguntas.some((t) => !t.valor)}
                      <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</p>
                    {:else}
                      <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Listo</p>
                    {/if}
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <!-- Heroicon name: solid/users -->
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                        />
                      </svg>
                      {evaluacion.responsable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="bg-white shadow overflow-hidden sm:rounded-m max-w-7xl mx-auto">
      <nav class="flex" aria-label="Breadcrumb">
        <ol role="list" class="bg-white rounded-md shadow px-6 flex space-x-4">
          <li class="flex">
            <div class="flex items-center">
              <a href="#" on:click={() => volver()} class="text-gray-400 hover:text-gray-500">
                <!-- Heroicon name: solid/home -->
                <svg class="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
                <span class="sr-only">Home</span>
              </a>
            </div>
          </li>

          <li class="flex">
            <div class="flex items-center">
              <svg
                class="flex-shrink-0 w-6 h-full text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <span class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">{servicio}</span>
            </div>
          </li>
        </ol>
      </nav>

      <ul role="list" class="divide-y divide-gray-200 mt-5">
        {#each preguntas as pregunta, j}
          <li class="px-4 sm:px-0">
            <div class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">{j + 1}. {pregunta.glosa}</p>
                </div>
                <div class="flex overflow-hidden -space-x-1">
                  <span class="relative z-0 inline-flex shadow-sm rounded-md">
                    {#each ["1", "2", "3", "4", "5", "6", "7"] as nota, i}
                      <button
                        disabled={respondiendo}
                        on:click={() => {
                          pregunta.valor = nota;
                          puntuar(nota, j);
                        }}
                        type="button"
                        class={pregunta.valor == i + 1
                          ? "relative inline-flex items-center px-4 py-2 rounded-l-md border bg-indigo-600 border-gray-300 text-sm font-medium text-white"
                          : "relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300  text-sm font-medium text-gray-700"}
                      >
                        {nota}
                      </button>
                    {/each}
                  </span>
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

{#if encuestaTerminada}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
      >
        <div>
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <!-- Heroicon name: outline/check -->
            <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Gracias por completar las encuestas</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
