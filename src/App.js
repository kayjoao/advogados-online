import React from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    deleteUser
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    setDoc, 
    getDoc, 
    onSnapshot, 
    deleteDoc, 
    updateDoc,
    query,
    where,
    getDocs,
    orderBy
} from 'firebase/firestore';
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    BrainCircuit, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Landmark,
    Plus,
    Trash2,
    Edit3,
    UserPlus,
    MessageSquare,
    AlertTriangle,
    BookOpen
} from 'lucide-react';

// --- INÍCIO: Configuração do Firebase ---
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// --- FIM: Configuração do Firebase ---

// --- Componentes da UI (Interface do Utilizador) ---

const Tooltip = ({ message, children }) => (
  <div className="relative flex flex-col items-center group">
    {children}
    <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
      <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-800 shadow-lg rounded-md">{message}</span>
      <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-800"></div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-center">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsModal = ({ isOpen, onClose, news }) => {
    if (!isOpen || !news) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">{news.title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-4">Publicado em: {news.date}</p>
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {news.fullText.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Spinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
);

// --- INÍCIO: Sub-componentes do Dashboard (Movidos para cima) ---

const DashboardView = ({ setActiveView }) => (
    <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Bem-vindo ao seu Painel de Gestão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div onClick={() => setActiveView('messages')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                <MessageSquare className="w-10 h-10 text-yellow-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-700">Ver Mensagens</h4>
                <p className="text-gray-500 mt-2">Veja os pedidos de contacto enviados pelo site.</p>
            </div>
            <div onClick={() => setActiveView('clients')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                <Users className="w-10 h-10 text-blue-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-700">Gerir Clientes</h4>
                <p className="text-gray-500 mt-2">Aceda, adicione e atualize informações dos seus clientes.</p>
            </div>
            <div onClick={() => setActiveView('cases')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                <Briefcase className="w-10 h-10 text-green-500 mb-4" />
                <h4 className="text-xl font-semibold text-gray-700">Gerir Processos</h4>
                <p className="text-gray-500 mt-2">Acompanhe o andamento de todos os seus casos.</p>
            </div>
        </div>
    </div>
);

const ContactMessages = () => {
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [confirmState, setConfirmState] = React.useState({ isOpen: false, messageId: null });

    React.useEffect(() => {
        const messagesCollectionRef = collection(db, 'contacts');
        const q = query(messagesCollectionRef, orderBy('submittedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                messagesData.push({ 
                    id: doc.id, 
                    ...data,
                    submittedAt: data.submittedAt.toDate() 
                });
            });
            setMessages(messagesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao buscar mensagens: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteClick = (messageId) => {
        setConfirmState({ isOpen: true, messageId: messageId });
    };

    const handleConfirmDelete = async () => {
        if (confirmState.messageId) {
            try {
                await deleteDoc(doc(db, 'contacts', confirmState.messageId));
            } catch (error) {
                console.error("Erro ao apagar mensagem: ", error);
            } finally {
                setConfirmState({ isOpen: false, messageId: null });
            }
        }
    };

    return (
        <>
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, messageId: null })}
                onConfirm={handleConfirmDelete}
                title="Apagar Mensagem"
                message="Tem a certeza que deseja apagar esta mensagem? Esta ação não pode ser desfeita."
            />
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Mensagens Recebidas</h3>
                {isLoading ? (
                    <div className="flex justify-center mt-10"><Spinner /></div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-left text-sm font-semibold text-gray-600">
                                    <th className="p-4">Data</th>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Telefone</th>
                                    <th className="p-4">Mensagem</th>
                                    <th className="p-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.length > 0 ? messages.map(msg => (
                                    <tr key={msg.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-600">{msg.submittedAt.toLocaleString('pt-BR')}</td>
                                        <td className="p-4 font-medium">{msg.name}</td>
                                        <td className="p-4 text-gray-600">{msg.email}</td>
                                        <td className="p-4 text-gray-600">{msg.phone}</td>
                                        <td className="p-4 text-gray-600 text-sm max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                        <td className="p-4">
                                            <Tooltip message="Apagar Mensagem">
                                                <button onClick={() => handleDeleteClick(msg.id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-6 text-gray-500">Nenhuma mensagem recebida.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

const ClientForm = ({ client, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState({
        name: client?.name || '',
        email: client?.email || '',
        phone: client?.phone || '',
        address: client?.address || '',
        status: client?.status || 'Potencial',
    });
    const [isSaving, setIsSaving] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Potencial</option>
                    <option>Ativo</option>
                    <option>Inativo</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
                    {isSaving && <Spinner />}
                    <span className="ml-2">Salvar</span>
                </button>
            </div>
        </form>
    );
};

const ClientManagement = ({ userRole }) => {
    const [clients, setClients] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingClient, setEditingClient] = React.useState(null);
    const [confirmState, setConfirmState] = React.useState({ isOpen: false, clientId: null });
    const [alertState, setAlertState] = React.useState({ isOpen: false, message: '' });

    React.useEffect(() => {
        const clientsCollectionRef = collection(db, 'clients');
        const q = query(clientsCollectionRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clientsData = [];
            querySnapshot.forEach((doc) => {
                clientsData.push({ id: doc.id, ...doc.data() });
            });
            clientsData.sort((a, b) => a.name.localeCompare(b.name));
            setClients(clientsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao buscar clientes: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddClient = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (clientId) => {
        if (userRole !== 'main_admin') {
            setAlertState({ isOpen: true, message: 'Não tem permissão para excluir clientes.' });
            return;
        }
        setConfirmState({ isOpen: true, clientId: clientId });
    };

    const handleConfirmDelete = async () => {
        if (confirmState.clientId) {
            try {
                await deleteDoc(doc(db, 'clients', confirmState.clientId));
            } catch (error) {
                console.error("Erro ao excluir cliente: ", error);
            } finally {
                setConfirmState({ isOpen: false, clientId: null });
            }
        }
    };

    const handleSaveClient = async (clientData) => {
        try {
            if (editingClient) {
                const clientRef = doc(db, 'clients', editingClient.id);
                await updateDoc(clientRef, clientData);
            } else {
                await addDoc(collection(db, 'clients'), clientData);
            }
            setIsModalOpen(false);
            setEditingClient(null);
        } catch (error) {
            console.error("Erro ao salvar cliente: ", error);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ isOpen: false, message: '' })}
                title="Acesso Negado"
                message={alertState.message}
            />
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, clientId: null })}
                onConfirm={handleConfirmDelete}
                title="Apagar Cliente"
                message="Tem a certeza que deseja apagar este cliente? Esta ação não pode ser desfeita."
            />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Lista de Clientes</h3>
                    <button onClick={handleAddClient} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center space-x-2">
                        <Plus size={18} />
                        <span>Novo Cliente</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center mt-10"><Spinner /></div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-left text-sm font-semibold text-gray-600">
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Telefone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clients.length > 0 ? clients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="p-4">{client.name}</td>
                                        <td className="p-4 text-gray-600">{client.email}</td>
                                        <td className="p-4 text-gray-600">{client.phone}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                client.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                                                client.status === 'Inativo' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>{client.status}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <Tooltip message="Editar">
                                                    <button onClick={() => handleEditClient(client)} className="text-blue-600 hover:text-blue-800"><Edit3 size={18} /></button>
                                                </Tooltip>
                                                {userRole === 'main_admin' && (
                                                    <Tooltip message="Excluir">
                                                        <button onClick={() => handleDeleteClick(client.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-6 text-gray-500">Nenhum cliente encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}>
                    <ClientForm client={editingClient} onSave={handleSaveClient} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </>
    );
};

const CaseForm = ({ caseItem, clients, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState({
        title: caseItem?.title || '',
        description: caseItem?.description || '',
        clientId: caseItem?.clientId || '',
        status: caseItem?.status || 'Ativo',
    });
    const [isSaving, setIsSaving] = React.useState(false);
    const [alertState, setAlertState] = React.useState({ isOpen: false, message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.clientId) {
            setAlertState({ isOpen: true, message: "Por favor, selecione um cliente." });
            return;
        }
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <>
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ isOpen: false, message: '' })}
                title="Campo Obrigatório"
                message={alertState.message}
            />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título / Nº do Processo</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cliente Associado</label>
                    <select name="clientId" value={formData.clientId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="" disabled>Selecione um cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option>Ativo</option>
                        <option>Pendente</option>
                        <option>Arquivado</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
                        {isSaving && <Spinner />}
                        <span className="ml-2">Salvar Processo</span>
                    </button>
                </div>
            </form>
        </>
    );
};

const CaseManagement = ({ userRole }) => {
    const [cases, setCases] = React.useState([]);
    const [clients, setClients] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingCase, setEditingCase] = React.useState(null);
    const [confirmState, setConfirmState] = React.useState({ isOpen: false, caseId: null });
    const [alertState, setAlertState] = React.useState({ isOpen: false, message: '' });

    React.useEffect(() => {
        const clientsUnsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
            const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClients(clientsData);
        });

        const casesUnsubscribe = onSnapshot(query(collection(db, 'cases'), orderBy('createdAt', 'desc')), (snapshot) => {
            const casesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCases(casesData);
            setIsLoading(false);
        });

        return () => {
            clientsUnsubscribe();
            casesUnsubscribe();
        };
    }, []);

    const handleAddCase = () => {
        setEditingCase(null);
        setIsModalOpen(true);
    };

    const handleEditCase = (caseItem) => {
        setEditingCase(caseItem);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (caseId) => {
        if (userRole !== 'main_admin') {
            setAlertState({ isOpen: true, message: 'Não tem permissão para excluir processos.' });
            return;
        }
        setConfirmState({ isOpen: true, caseId: caseId });
    };

    const handleConfirmDelete = async () => {
        if (confirmState.caseId) {
            try {
                await deleteDoc(doc(db, 'cases', confirmState.caseId));
            } catch (error) {
                console.error("Erro ao excluir processo: ", error);
            } finally {
                setConfirmState({ isOpen: false, caseId: null });
            }
        }
    };

    const handleSaveCase = async (caseData) => {
        try {
            const client = clients.find(c => c.id === caseData.clientId);
            const dataToSave = {
                ...caseData,
                clientName: client ? client.name : 'Não especificado'
            };

            if (editingCase) {
                const caseRef = doc(db, 'cases', editingCase.id);
                await updateDoc(caseRef, dataToSave);
            } else {
                await addDoc(collection(db, 'cases'), { ...dataToSave, createdAt: new Date() });
            }
            setIsModalOpen(false);
            setEditingCase(null);
        } catch (error) {
            console.error("Erro ao salvar processo: ", error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Ativo': return 'bg-green-100 text-green-800';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800';
            case 'Arquivado': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <>
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ isOpen: false, message: '' })}
                title="Acesso Negado"
                message={alertState.message}
            />
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, caseId: null })}
                onConfirm={handleConfirmDelete}
                title="Apagar Processo"
                message="Tem a certeza que deseja apagar este processo? Esta ação não pode ser desfeita."
            />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Lista de Processos</h3>
                    <button onClick={handleAddCase} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm flex items-center space-x-2">
                        <Plus size={18} />
                        <span>Novo Processo</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center mt-10"><Spinner /></div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-left text-sm font-semibold text-gray-600">
                                    <th className="p-4">Título / Nº Processo</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cases.length > 0 ? cases.map(caseItem => (
                                    <tr key={caseItem.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{caseItem.title}</td>
                                        <td className="p-4 text-gray-600">{caseItem.clientName}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(caseItem.status)}`}>
                                                {caseItem.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <Tooltip message="Editar">
                                                    <button onClick={() => handleEditCase(caseItem)} className="text-blue-600 hover:text-blue-800"><Edit3 size={18} /></button>
                                                </Tooltip>
                                                {userRole === 'main_admin' && (
                                                    <Tooltip message="Excluir">
                                                        <button onClick={() => handleDeleteClick(caseItem.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-6 text-gray-500">Nenhum processo encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCase ? "Editar Processo" : "Adicionar Novo Processo"}>
                    <CaseForm caseItem={editingCase} clients={clients} onSave={handleSaveCase} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </>
    );
};

const AITool = ({ apiKey }) => {
    const [inputText, setInputText] = React.useState('');
    const [result, setResult] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleAnalysis = async () => {
        if (!inputText.trim()) {
            setError('Por favor, insira um texto para análise.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');

        const prompt = `Como um assistente jurídico especialista, analise o seguinte texto e forneça um resumo conciso dos pontos chave, identifique possíveis riscos ou oportunidades e sugira os próximos passos recomendados. Formate a resposta em HTML simples, usando tags como <h3> para títulos, <strong> para negrito, e <ul> com <li> para listas. Não inclua a tag <html> ou <body>, apenas o conteúdo HTML interno. Texto: "${inputText}"`;

        try {
            const effectiveApiKey = apiKey || ""; 
            if (!effectiveApiKey) {
                throw new Error("A chave de API da IA não está configurada. Por favor, adicione a variável de ambiente REACT_APP_GEMINI_API_KEY nas configurações da Vercel.");
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.statusText} - ${errorData.error?.message}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                setResult(data.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Resposta da API inválida ou vazia.");
            }

        } catch (err) {
            console.error("Erro na chamada da API Gemini:", err);
            setError(`Não foi possível realizar a análise. Detalhes: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Análise Jurídica com IA</h3>
            <p className="text-gray-600 mb-4">Cole um trecho de um documento, petição ou contrato abaixo para que a nossa Inteligência Artificial realize uma análise preliminar.</p>
            
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Cole o texto aqui..."
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
            />

            <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center justify-center"
            >
                {isLoading ? <Spinner /> : <><BrainCircuit size={18} className="mr-2" /> Analisar Texto</>}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {result && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-lg mb-2">Resultado da Análise:</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result }}></div>
                </div>
            )}
        </div>
    );
};

const InviteUserForm = ({ onInvite, onCancel }) => {
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('secondary_admin');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await onInvite(email, role);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">Insira o email do utilizador e a sua função. Ele receberá acesso assim que se registar com este email.</p>
            <div>
                <label className="block text-sm font-medium">Email do Utilizador</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
                <label className="block text-sm font-medium">Função</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 w-full rounded-md border-gray-300">
                    <option value="secondary_admin">Admin Secundário</option>
                    <option value="main_admin">Admin Principal</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-blue-300">
                    {isSaving ? 'A Convidar...' : 'Convidar Utilizador'}
                </button>
            </div>
        </form>
    );
};

const SettingsPanel = () => {
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    React.useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
            setIsLoading(false);
        }, (err) => {
            console.error(err);
            setError("Falha ao carregar utilizadores.");
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleInviteUser = async (email, role) => {
        setError('');
        setSuccess('');
        try {
            const userQuery = query(collection(db, 'users'), where("email", "==", email));
            const existingUser = await getDocs(userQuery);
            if (!existingUser.empty) {
                throw new Error("Já existe um utilizador registado com este email.");
            }

            const invitationsRef = collection(db, 'invitations');
            const invitationDoc = doc(invitationsRef, email);
            const invitationSnap = await getDoc(invitationDoc);
            if(invitationSnap.exists()) {
                throw new Error("Já existe um convite pendente para este email.");
            }

            await setDoc(invitationDoc, { role: role });

            setSuccess(`Convite enviado para ${email} com a função de ${role}. O utilizador precisa de se registar com este email para obter acesso.`);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro ao convidar utilizador: ", err);
            setError(err.message || "Não foi possível enviar o convite.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Gestão de Utilizadores</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center space-x-2">
                    <UserPlus size={18} />
                    <span>Convidar Utilizador</span>
                </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}
            {isLoading ? <Spinner /> : (
                 <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Função</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role.replace('_', ' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Convidar Novo Utilizador">
                <InviteUserForm onInvite={handleInviteUser} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

// --- FIM: Sub-componentes do Dashboard ---


// --- Componentes Principais da Aplicação (Movidos para o final) ---

const HomePage = ({ onLoginClick, onContactSubmit }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitMessage, setSubmitMessage] = React.useState('');
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [selectedNews, setSelectedNews] = React.useState(null);

    const services = [
        { icon: <Briefcase className="w-10 h-10 text-blue-600" />, title: "Gestão de Processos", description: "Organize os seus casos, prazos e documentos num só lugar, com acesso rápido e seguro." },
        { icon: <BrainCircuit className="w-10 h-10 text-blue-600" />, title: "Inteligência Artificial", description: "Utilize a nossa IA para analisar documentos, encontrar jurisprudência e otimizar as suas decisões." },
        { icon: <Users className="w-10 h-10 text-blue-600" />, title: "CRM Jurídico", description: "Faça a gestão do relacionamento com os seus clientes, desde o primeiro contacto até à conclusão do caso." }
    ];

    const news = [
        { 
            title: "STF define novas regras para aposentadoria especial", 
            date: "04/07/2025", 
            summary: "A decisão impacta milhares de trabalhadores e redefine os critérios de comprovação de atividade de risco.",
            fullText: "O Supremo Tribunal Federal (STF) concluiu o julgamento do Tema 1.031 da Repercussão Geral, estabelecendo que o uso de Equipamento de Proteção Individual (EPI) eficaz não descaracteriza o tempo de serviço especial para aposentadoria, caso a exposição ao agente nocivo persista.\nA decisão, tomada por maioria, altera o entendimento anterior e terá grande impacto nos pedidos de aposentadoria especial, especialmente para profissionais da saúde e da indústria. Os escritórios de advocacia previdenciária já se preparam para uma onda de revisões e novos processos baseados na tese firmada."
        },
        { 
            title: "Nova Lei de Licitações: Fim do prazo de adaptação", 
            date: "01/07/2025", 
            summary: "Órgãos públicos devem agora seguir exclusivamente a Lei nº 14.133/2021. O que muda na prática para contratos com o governo?",
            fullText: "Chegou ao fim o período de transição para a nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021). A partir de agora, a antiga Lei 8.666/93 está oficialmente revogada para a maioria dos casos.\nAs principais mudanças incluem a criação de novas modalidades de licitação, como o diálogo competitivo, a inversão de fases (julgamento antes da habilitação) como regra geral, e um foco maior na governança e no planeamento das contratações. Para empresas que contratam com o poder público, é crucial a atualização dos seus processos internos e a capacitação das suas equipas jurídicas para navegar no novo marco regulatório e evitar sanções."
        },
        { 
            title: "Marco Legal das Startups: O que esperar do novo ambiente de negócios?", 
            date: "28/06/2025", 
            summary: "Sancionado recentemente, o marco legal visa fomentar o empreendedorismo e a inovação no Brasil.",
            fullText: "O Marco Legal das Startups (Lei Complementar nº 182/2021) introduz uma série de medidas para simplificar a criação de empresas inovadoras e estimular o investimento.\nEntre os destaques estão a criação da figura da 'sociedade anônima simplificada', a regulamentação dos 'investidores-anjo' (que não terão responsabilidade pelas dívidas da empresa) e a possibilidade de as startups participarem de um ambiente regulatório experimental (sandbox regulatório). A expectativa é que a nova lei reduza a burocracia, aumente a segurança jurídica para investidores e impulsione a criação de novos negócios tecnológicos no país."
        }
    ];

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            message: e.target.message.value,
            submittedAt: new Date()
        };
        
        try {
            await onContactSubmit(formData);
            setSubmitMessage('A sua mensagem foi enviada com sucesso! Entraremos em contacto em breve.');
            e.target.reset();
        } catch (error) {
            console.error("Erro ao enviar contacto:", error);
            setSubmitMessage('Ocorreu um erro ao enviar a sua mensagem. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewsClick = (newsItem) => {
        setSelectedNews(newsItem);
        setIsNewsModalOpen(true);
    };

    return (
        <>
            <NewsModal 
                isOpen={isNewsModalOpen} 
                onClose={() => setIsNewsModalOpen(false)} 
                news={selectedNews} 
            />
            <div className="bg-gray-50 text-gray-800">
                <header className="bg-white shadow-md sticky top-0 z-40">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Landmark className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-800">Advocacia Pro</h1>
                        </div>
                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="#services" className="hover:text-blue-600 transition-colors">Serviços</a>
                            <a href="#news" className="hover:text-blue-600 transition-colors">Notícias</a>
                            <a href="#contact" className="hover:text-blue-600 transition-colors">Contacto</a>
                        </nav>
                        <button onClick={onLoginClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                            Acesso Restrito
                        </button>
                    </div>
                </header>

                <main>
                    <section className="bg-blue-700 text-white text-center py-20 px-6">
                        <div className="container mx-auto">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Soluções Jurídicas Inteligentes para o Advogado Moderno</h2>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-100">Combine gestão eficiente, tecnologia de ponta e captação de clientes numa única plataforma.</p>
                        </div>
                    </section>

                    <section id="services" className="py-20 px-6 bg-white">
                        <div className="container mx-auto">
                            <h3 className="text-3xl font-bold text-center mb-12">As Nossas Ferramentas</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                {services.map(service => (
                                    <div key={service.title} className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                                        <div className="mb-4">{service.icon}</div>
                                        <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                                        <p className="text-gray-600">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    <section id="news" className="py-20 px-6 bg-gray-50">
                        <div className="container mx-auto">
                            <h3 className="text-3xl font-bold text-center mb-12">Últimas Notícias do Mundo Jurídico</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                {news.map(item => (
                                    <div key={item.title} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                                        <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                                        <h4 className="text-lg font-semibold mb-3 flex-grow">{item.title}</h4>
                                        <p className="text-gray-600 text-sm mb-4">{item.summary}</p>
                                        <button 
                                            onClick={() => handleNewsClick(item)} 
                                            className="mt-auto bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all text-sm font-semibold flex items-center justify-center"
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Ler Mais
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="contact" className="py-20 px-6 bg-blue-800">
                        <div className="container mx-auto max-w-2xl">
                            <h3 className="text-3xl font-bold text-center mb-8 text-white">Marque um Atendimento</h3>
                            <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-lg shadow-2xl space-y-6">
                                <input type="text" name="name" placeholder="O seu Nome Completo" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <input type="email" name="email" placeholder="O seu Melhor E-mail" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <input type="tel" name="phone" placeholder="O seu Telefone (WhatsApp)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                <textarea name="message" placeholder="Descreva brevemente o seu caso" rows="4" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400 flex items-center justify-center">
                                    {isSubmitting ? <Spinner /> : 'Enviar Solicitação'}
                                </button>
                                {submitMessage && <p className={`text-center mt-4 ${submitMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{submitMessage}</p>}
                            </form>
                        </div>
                    </section>
                </main>

                <footer className="bg-gray-800 text-white py-8">
                    <div className="container mx-auto px-6 text-center">
                        <p>&copy; {new Date().getFullYear()} Advocacia Pro. Todos os direitos reservados.</p>
                        <p className="text-sm text-gray-400 mt-2">Este é um site modelo. As informações aqui contidas são fictícias.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

const AuthPage = ({ onLogin, onRegister, onBack, authError, authMessage }) => {
    const [isLoginView, setIsLoginView] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (isLoginView) {
            await onLogin(email, password);
        } else {
            await onRegister(email, password);
        }
        setIsLoading(false);
    };

    const title = isLoginView ? "Acesso ao Painel de Gestão" : "Criar Conta de Administrador";
    const buttonText = isLoginView ? "Entrar" : "Registar";
    const switchText = isLoginView ? "Não tem uma conta?" : "Já tem uma conta?";
    const switchLinkText = isLoginView ? "Registe-se aqui" : "Faça o login aqui";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Landmark className="w-10 h-10 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Advocacia Pro</h1>
                    </div>
                    <h2 className="text-xl text-gray-600">{title}</h2>
                    {!isLoginView && <p className="text-sm text-gray-500 mt-2">O primeiro utilizador registado será o Administrador Principal.</p>}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                    {authMessage && <p className="text-green-600 text-sm text-center">{authMessage}</p>}
                    <button type="submit" disabled={isLoading} className={`w-full text-white p-3 rounded-lg font-semibold transition-all flex justify-center ${isLoginView ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'}`}>
                        {isLoading ? <Spinner /> : buttonText}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        {switchText}{' '}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:text-blue-700">
                            {switchLinkText}
                        </button>
                    </p>
                    <button onClick={onBack} className="w-full mt-4 text-center text-sm text-gray-600 hover:text-blue-600">
                        Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = ({ user, userRole, onLogout }) => {
    const [activeView, setActiveView] = React.useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'messages', label: 'Mensagens', icon: MessageSquare }, 
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'cases', label: 'Processos', icon: Briefcase },
        { id: 'ai_tool', label: 'Ferramenta IA', icon: BrainCircuit },
        ...(userRole === 'main_admin' ? [{ id: 'settings', label: 'Configurações', icon: Settings }] : [])
    ];

    const renderView = () => {
        switch (activeView) {
            case 'messages': return <ContactMessages />; 
            case 'clients': return <ClientManagement userRole={userRole} />;
            case 'cases': return <CaseManagement userRole={userRole} />;
            case 'ai_tool': return <AITool apiKey={process.env.REACT_APP_GEMINI_API_KEY} />;
            case 'settings': {
                if (userRole === 'main_admin') {
                    return <SettingsPanel />;
                }
                return <p>Acesso negado.</p>;
            }
            case 'dashboard':
            default:
                return <DashboardView setActiveView={setActiveView} />;
        }
    };
    
    const Sidebar = () => (
        <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <Landmark className="w-8 h-8 text-blue-400" />
                    <span className="text-xl font-bold">Advocacia Pro</span>
                </div>
                <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X/></button>
            </div>
            <nav>
                {navItems.map(item => (
                    <button key={item.id} onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full left-0 px-4 py-6">
                 <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-600">
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b">
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                        <Menu />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-700 capitalize">{navItems.find(i => i.id === activeView)?.label}</h2>
                    <div className="flex items-center space-x-2">
                         <span className="text-sm text-gray-600 hidden sm:block">{user.email} ({userRole === 'main_admin' ? 'Admin Principal' : 'Admin Secundário'})</span>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};


// --- Componente Principal da Aplicação (App) ---
export default function App() {
    const [view, setView] = React.useState('loading'); 
    const [user, setUser] = React.useState(null);
    const [userRole, setUserRole] = React.useState(null); 
    const [authError, setAuthError] = React.useState('');
    const [authMessage, setAuthMessage] = React.useState('');

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const role = userDocSnap.data().role;
                    setUserRole(role);
                    setUser(currentUser);
                    setView('dashboard');
                } else {
                    console.warn(`Utilizador ${currentUser.email} autenticado, mas o documento de função não foi encontrado. A fazer logout.`);
                    await signOut(auth);
                }
            } else {
                setUser(null);
                setUserRole(null);
                setView('home');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAuthAction = async (action, email, password) => {
        setAuthError('');
        setAuthMessage('');
        try {
            if (action === 'register') {
                setAuthMessage('A registar...');
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;
                
                setAuthMessage('Conta criada. A verificar permissões...');

                let role = null;
                
                const usersCollectionRef = collection(db, "users");
                const q = query(usersCollectionRef);
                const allUsersSnap = await getDocs(q);
                
                if (allUsersSnap.empty) {
                    role = 'main_admin';
                } else {
                    const invitationDocRef = doc(db, "invitations", email);
                    const invitationSnap = await getDoc(invitationDocRef);
                    if (invitationSnap.exists()) {
                        role = invitationSnap.data().role;
                    }
                }

                if (!role) {
                    await deleteUser(newUser);
                    throw new Error("Registo não autorizado. Peça a um administrador para o convidar.");
                }

                const userDocRef = doc(db, "users", newUser.uid);
                await setDoc(userDocRef, { email: newUser.email, role: role });

                const invitationDocRef = doc(db, "invitations", email);
                if ((await getDoc(invitationDocRef)).exists()) {
                    await deleteDoc(invitationDocRef);
                }
                
                setAuthMessage('Conta configurada com sucesso! A entrar...');

            } else { // login
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error(`Erro de ${action}: `, error);
            let message = error.message; 
            if (error.code === 'auth/email-already-in-use') {
                message = 'Este email já está a ser utilizado.';
            } else if (error.code === 'auth/invalid-credential') {
                message = 'Email ou senha inválidos.';
            } else if (error.code === 'permission-denied') {
                message = 'Erro de permissão! Verifique as regras de segurança do Firestore.';
            }
            setAuthError(message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleContactSubmit = async (formData) => {
        try {
            await addDoc(collection(db, 'contacts'), formData);
        } catch (error) {
            console.error("Erro ao salvar contacto no Firestore:", error);
            throw error;
        }
    };

    const renderContent = () => {
        switch(view) {
            case 'loading':
                return <div className="min-h-screen flex justify-center items-center bg-gray-100"><Spinner /></div>;
            case 'dashboard':
                return user ? <AdminDashboard user={user} userRole={userRole} onLogout={handleLogout} /> : <AuthPage onLogin={(e,p) => handleAuthAction('login', e, p)} onRegister={(e,p) => handleAuthAction('register', e, p)} onBack={() => setView('home')} authError={authError} authMessage={authMessage} />;
            case 'auth':
                 return <AuthPage onLogin={(e,p) => handleAuthAction('login', e, p)} onRegister={(e,p) => handleAuthAction('register', e, p)} onBack={() => setView('home')} authError={authError} authMessage={authMessage} />;
            case 'home':
            default:
                return <HomePage onLoginClick={() => setView('auth')} onContactSubmit={handleContactSubmit} />;
        }
    }

    return renderContent();
}
